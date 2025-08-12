import React from "react";

import UserPage from "@/components/users";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Users() {
  return <UserPage />;
}

Users.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;