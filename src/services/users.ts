import { ValidationError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { User, createdBy } from "@/types/user";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const includeRelations = {
    include: {
        role: true,
        createdBy: {
            select: {
                id: true,
                username: true,
                email: true,
            },
        },
        updatedBy: {
            select: {
                id: true,
                username: true,
                email: true,
            },
        },
    },
};

type UserWithRelations = Prisma.UserGetPayload<typeof includeRelations>;

const transformUser = (rawUser: UserWithRelations): User => {
    const user: User = {
        id: rawUser.id,
        username: rawUser.username,
        firstName: rawUser.firstName,
        lastName: rawUser.lastName || undefined,
        department: rawUser.department || undefined,
        email: rawUser.email,
        active: rawUser.active,
        createdDate: rawUser.createdAt,
        lastLoginDate: rawUser.lastLoginDate || undefined,
        passwordChange: rawUser.passwordChange,
        archived: rawUser.archived,
        archivedAt: rawUser.archivedAt || undefined,
        roleId: rawUser.roleId,
        role: rawUser.role,
    };
    return user;
};

export const getUsers = async (): Promise<User[]> => {
    const users = await prisma.user.findMany({
        where: {
            archived: false,
        },
        ...includeRelations,
    });
    return users.map(transformUser);
};

export const getUser = async (id: number): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: { id },
        ...includeRelations,
    });
    
    if (!user || user.archived) {
        throw new ValidationError(1001, 404, "User not found");
    }
    
    return transformUser(user);
};

export const createUser = async (userData: User, userId: number): Promise<User> => {
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password || !userData.firstName || !userData.roleId) {
        throw new ValidationError(1001, 400, "Username, email, password, first name, and role are required");
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
        where: { 
            username: userData.username,
            archived: false,
        },
    });

    if (existingUsername) {
        throw new ValidationError(1001, 409, "Username already exists");
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({
        where: { 
            email: userData.email,
            archived: false,
        },
    });

    if (existingEmail) {
        throw new ValidationError(1001, 409, "Email already exists");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        throw new ValidationError(1001, 400, "Invalid email format");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = await prisma.user.create({
        data: {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            department: userData.department,
            email: userData.email,
            passwordHash,
            salt,
            active: userData.active ?? true,
            passwordChange: userData.passwordChange ?? false,
            roleId: userData.roleId,
            createdById: userId,
        },
        ...includeRelations,
    });

    return transformUser(newUser);
};

export const updateUser = async (id: number, userData: User, userId: number): Promise<User> => {
    // Check if user exists
    const existingUser = await getUser(id);

    // Prepare update data
    const updateData: any = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        department: userData.department,
        active: userData.active,
        passwordChange: userData.passwordChange,
        roleId: userData.roleId,
        updatedById: userId,
    };

    // Check username uniqueness if changed
    if (userData.username && userData.username !== existingUser.username) {
        const existingUsername = await prisma.user.findFirst({
            where: { 
                username: userData.username,
                archived: false,
            },
        });

        if (existingUsername) {
            throw new ValidationError(1001, 409, "Username already exists");
        }
        updateData.username = userData.username;
    }

    // Check email uniqueness if changed
    if (userData.email && userData.email !== existingUser.email) {
        const existingEmail = await prisma.user.findFirst({
            where: { 
                email: userData.email,
                archived: false,
            },
        });

        if (existingEmail) {
            throw new ValidationError(1001, 409, "Email already exists");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new ValidationError(1001, 400, "Invalid email format");
        }
        updateData.email = userData.email;
    }

    // Hash new password if provided
    if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userData.password, salt);
        updateData.passwordHash = passwordHash;
        updateData.salt = salt;
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        ...includeRelations,
    });

    return transformUser(updatedUser);
};

export const deleteUser = async (id: number, userId: number): Promise<void> => {
    // Check if user exists
    await getUser(id);

    // Soft delete: archive the user
    await prisma.user.update({
        where: { id },
        data: {
            archived: true,
            archivedAt: new Date(),
            active: false,
            updatedById: userId,
        },
    });
};

export const changePassword = async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new ValidationError(1001, 404, "User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
        throw new ValidationError(1001, 401, "Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id },
        data: {
            passwordHash,
            salt,
            passwordChange: false,
            updatedById: id,
        },
    });
};

export const adminChangePassword = async (id: number, newPassword: string, adminId: number): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user || user.archived) {
        throw new ValidationError(1001, 404, "User not found");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id },
        data: {
            passwordHash,
            salt,
            passwordChange: false,
            updatedById: adminId,
        },
    });
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: { 
            username,
            archived: false,
        },
        ...includeRelations,
    });

    return user ? transformUser(user) : null;
};

export const updateLastLogin = async (id: number): Promise<void> => {
    await prisma.user.update({
        where: { id },
        data: {
            lastLoginDate: new Date(),
        },
    });
};

export const restoreUser = async (id: number, userId: number): Promise<User> => {
    // Check if user exists (including archived)
    const user = await prisma.user.findUnique({
        where: { id },
        ...includeRelations,
    });
    
    if (!user) {
        throw new ValidationError(1001, 404, "User not found");
    }
    
    if (!user.archived) {
        throw new ValidationError(1001, 400, "User is not archived");
    }
    
    // Check if username or email are already in use by active users
    const existingUsername = await prisma.user.findFirst({
        where: {
            username: user.username,
            archived: false,
        },
    });
    
    if (existingUsername) {
        throw new ValidationError(1001, 409, `Cannot restore user. Username "${user.username}" is already in use`);
    }
    
    const existingEmail = await prisma.user.findFirst({
        where: {
            email: user.email,
            archived: false,
        },
    });
    
    if (existingEmail) {
        throw new ValidationError(1001, 409, `Cannot restore user. Email "${user.email}" is already in use`);
    }
    
    // Restore the user
    const restoredUser = await prisma.user.update({
        where: { id },
        data: {
            archived: false,
            archivedAt: null,
            active: true,
            updatedById: userId,
        },
        ...includeRelations,
    });
    
    return transformUser(restoredUser);
};