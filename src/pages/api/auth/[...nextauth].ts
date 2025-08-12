import { NextApiRequest, NextApiResponse } from 'next';
import Credentials from "next-auth/providers/credentials";
import NextAuth, { User, Session, NextAuthOptions } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from 'next-auth/jwt';
import { compare } from "bcryptjs";
import prisma from "../../../lib/prisma";

const providers = [
  Credentials({
    name: 'Credentials',
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" }
    },
    authorize: async (credentials: Record<"username" | "password", string> | undefined) => {
      try {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please provide username and password');
        }

        // Find user in database
        const user = await prisma.user.findFirst({
          where: { 
            username: credentials.username.trim(),
            archived: false, // Only allow active users
            active: true
          },
          include: {
            role: true
          }
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update last login date
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginDate: new Date() }
        });

        // Return user data for session
        return {
          id: user.id.toString(),
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email,
          username: user.username,
          role: user.role.name,
          roleId: user.roleId,
          department: user.department,
        } as User & {
          username: string;
          role: string;
          roleId: number;
          department?: string;
        };

      } catch (error) {
        console.log('Login error:', error);
        return null; // Return null for failed authentication
      }
    }
  }),
];

const callbacks = {
  async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
    if (user) {
      // Store user data in token on first sign in
      token.userId = user.id;
      token.username = user.username;
      token.role = user.role;
      token.roleId = user.roleId;
      token.department = user.department;
    }

    return token;
  },
  async session({ session, token }: { 
    session: Session & { 
      userId?: string; 
      username?: string; 
      role?: string; 
      roleId?: number; 
      department?: string; 
    }; 
    token: JWT; 
  }): Promise<Session> {
    // Pass user data to session
    if (token) {
      session.userId = token.userId as string;
      session.username = token.username as string;
      session.role = token.role as string;
      session.roleId = token.roleId as number;
      session.department = token.department as string;
      
      // Also add to user object for compatibility
      if (session.user) {
        (session.user as any).id = token.userId; // Fix: Set id to the actual userId
        (session.user as any).userId = token.userId;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).roleId = token.roleId;
        (session.user as any).department = token.department;
      }
    }

    return session;
  },
};

export const options: NextAuthOptions = {
  providers,
  callbacks,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);