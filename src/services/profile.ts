import { ValidationError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { User } from "@/types/user";
import { Prisma } from "@prisma/client";

const includeRelations = {
    include: {
        role: true,
    },
};

type UserWithRelations = Prisma.UserGetPayload<typeof includeRelations>;

const transformUserProfile = (rawUser: UserWithRelations): User => {
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

export const getCurrentUserProfile = async (userId: number): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        ...includeRelations,
    });
    
    if (!user || user.archived) {
        throw new ValidationError(1001, 404, "User not found");
    }
    
    return transformUserProfile(user);
};

export const updateCurrentUserProfile = async (userId: number, profileData: Partial<User>): Promise<User> => {
    // Get current user to check existing data
    const existingUser = await getCurrentUserProfile(userId);

    // Validate fields that can be updated
    const allowedFields = ['firstName', 'lastName', 'email', 'department'];
    const updateData: any = {};

    // Only update allowed fields
    for (const field of allowedFields) {
        if (profileData[field as keyof User] !== undefined) {
            updateData[field] = profileData[field as keyof User];
        }
    }

    // Check email uniqueness if changed
    if (updateData.email && updateData.email !== existingUser.email) {
        const existingEmail = await prisma.user.findFirst({
            where: { 
                email: updateData.email,
                archived: false,
                NOT: { id: userId } // Exclude current user
            },
        });

        if (existingEmail) {
            throw new ValidationError(1001, 409, "Email already exists");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
            throw new ValidationError(1001, 400, "Invalid email format");
        }
    }

    // Add audit fields
    updateData.updatedById = userId;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        ...includeRelations,
    });

    return transformUserProfile(updatedUser);
};