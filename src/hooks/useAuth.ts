import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  userId?: string;
  username?: string;
  role?: string;
  roleId?: number;
  department?: string;
}

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  roleId?: number;
  department?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  session: ExtendedSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isViewer: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  
  const extendedSession = session as ExtendedSession;

  
  
  const user: AuthUser | null = session?.user ? {
    id: extendedSession.userId,
    name: (session.user as any).name || undefined,
    email: (session.user as any).email || undefined,
    username: extendedSession.username,
    role: extendedSession.role,
    roleId: extendedSession.roleId,
    department: extendedSession.department,
  } : null;

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const isAdmin = extendedSession?.role?.toLowerCase() === 'admin';
  const isManager = extendedSession?.role?.toLowerCase() === 'manager';
  const isViewer = extendedSession?.role?.toLowerCase() === 'viewer';
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin || isManager;

  return {
    user,
    session: extendedSession,
    isAuthenticated,
    isLoading,
    isAdmin,
    isManager,
    isViewer,
    canEdit,
    canDelete,
  };
}