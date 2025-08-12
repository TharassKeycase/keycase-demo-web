import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface WithAuthOptions {
  redirectTo?: string;
  requiredRole?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requiredRole } = options;

  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Still loading

      if (!session) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const userRole = (session as any).role?.toLowerCase();
        if (userRole !== requiredRole.toLowerCase()) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [session, status, router]);

    // Show loading spinner while checking authentication
    if (status === 'loading') {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      );
    }

    // Don't render component if not authenticated
    if (!session) {
      return null;
    }

    // Check role authorization
    if (requiredRole) {
      const userRole = (session as any).role?.toLowerCase();
      if (userRole !== requiredRole.toLowerCase()) {
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}