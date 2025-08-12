import React from "react";

import SettingsPage from "@/components/settings";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Settings() {
  return <SettingsPage />;
}

Settings.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;