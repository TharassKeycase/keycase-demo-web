import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from '../pages/api/auth/[...nextauth]';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: number;
    sub: number;
    username: string;
    role: string;
    roleId: number;
    email: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  requiredRole?: string
): Promise<boolean> {
  try {
    // Get session from NextAuth
    const session = await getServerSession(req, res, options);
    console.log('Auth middleware - session:', session ? 'exists' : 'null', session);
    
    if (!session) {
      console.log('Auth middleware - no session found');
      res.status(401).json({ error: 'Authentication required' });
      return false;
    }

    // Add user info to request
    req.user = {
      id: (session as any).userId,
      username: (session as any).username,
      role: (session as any).role,
      roleId: (session as any).roleId,
      email: (session.user as any)?.email || '',
      sub: (session as any).sub,
    };

    // Check role if required
    if (requiredRole) {
      const userRole = req.user.role?.toLowerCase();
      const required = requiredRole.toLowerCase();
      
      if (userRole !== required && userRole !== 'admin') {
        res.status(403).json({ 
          error: `Access denied. Required role: ${requiredRole}. Your role: ${req.user.role}` 
        });
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
    return false;
  }
}

