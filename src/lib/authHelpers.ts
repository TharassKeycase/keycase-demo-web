import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

/**
 * Higher-order function that wraps getServerSideProps with authentication check
 * Redirects to login page if user is not authenticated
 */
export function withAuthServerSideProps(
  getServerSidePropsFunc?: GetServerSideProps
): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // If there's a custom getServerSideProps function, call it with the session
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      
      // If the custom function returns props, merge the session into it
      if (result && 'props' in result) {
        return {
          ...result,
          props: {
            ...result.props,
            session,
          },
        };
      }
      
      return result;
    }

    // Default: just return the session
    return {
      props: {
        session,
      },
    };
  };
}

/**
 * Simple auth check for pages that only need authentication validation
 * No additional server-side logic required
 */
export const requireAuth: GetServerSideProps = withAuthServerSideProps();