import React from "react";

import CustomerPage from "@/components/customers";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Customers() {
  return <CustomerPage />;
}

Customers.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;