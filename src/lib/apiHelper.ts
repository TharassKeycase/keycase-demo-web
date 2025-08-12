import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';


import prisma from './prisma';
import { getToken } from 'next-auth/jwt';
import { User } from '@prisma/client';
import { ValidationError } from './errors';
import { AuthenticatedRequest } from './authMiddleware';

export async function getUserByUsername(username: string) {
  return await prisma.user.findFirst({
    where: { username, archived: false },
    include: {
      role: true,
    },
  });
}

export async function getUserByUsernameOrEmail(usernameOrEmail: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
      archived: false,
    },
  });
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  // Return null if user is archived
  if (user && user.archived) {
    return null;
  }
  
  return user;
}

export async function getUserByToken(req: NextApiRequest): Promise<User> {
  const secret = process.env.NEXTAUTH_SECRET || "";
  // Try to get token from next-auth (for pages)
  const tokenVal = await getToken({ req, secret });

  if (tokenVal) {

    return {
      ...tokenVal,
      id: Number(tokenVal.id),
    } as User;
  }

  // Fallback: get token from the Authorization header (for API calls)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret) as User;
    return decoded;

  }

  throw new Error("Authentication error");
}


export function authenticateJWT(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const user = await getUserByToken(req);
      if (!user) {
        return res.status(401).json({ message: 'Authentication error' });
      }
      (req as any).user = user;

      const result = await handler(req, res);
      return result;

    } catch (error) {
      if (
        error instanceof ValidationError
      ) {
        return res.status(error.statusCode).json({ error: error.message });
      } else if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      else {
        console.error("Unexpected error in authenticateJWT:", error);
        return res.status(500).json({ error: 'Technical error' });
      }

    }
  };
}

export function requireRole(roles: string[]) {
  return function (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
    return authenticateJWT(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const userWithRole = req.user.role;
        if (!userWithRole ) {
          return res.status(403).json({ error: 'Access denied: No role assigned' });
        }

        const userRole = userWithRole.toLowerCase();
        const hasPermission = roles.some(role => role.toLowerCase() === userRole);

        if (!hasPermission) {
          return res.status(403).json({ 
            error: `Access denied: Required role(s): ${roles.join(', ')}. Your role: ${userWithRole}` 
          });
        }

        // Attach full user info to request for handler use
        (req as any).user = userWithRole;
        return await handler(req, res);
      } catch (error) {
        console.error("Error in requireRole middleware:", error);
        return res.status(500).json({ error: 'Authorization error' });
      }
    });
  };
}

// Specific permission middleware functions based on frontend logic
export function requireEdit() {
  return requireRole(['admin', 'manager']);
}

export function requireDelete() {
  return requireRole(['admin', 'manager']);
}

export function requireAdmin() {
  return requireRole(['admin']);
}

export function requireView() {
  return requireRole(['admin', 'manager', 'user', 'viewer']);
}

// Helper functions to check permissions (similar to frontend useAuth)
export function checkCanEdit(userRole: string): boolean {
  const role = userRole.toLowerCase();
  return role === 'admin' || role === 'manager';
}

export function checkCanDelete(userRole: string): boolean {
  const role = userRole.toLowerCase();
  return role === 'admin' || role === 'manager';
}

export function checkIsAdmin(userRole: string): boolean {
  return userRole.toLowerCase() === 'admin';
}

