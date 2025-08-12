import React from "react";

import ProfilePage from "@/components/profile";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Profile() {
  return <ProfilePage />;
}

Profile.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;