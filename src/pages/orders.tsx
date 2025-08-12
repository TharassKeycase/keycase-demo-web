import React from "react";

import OrderPage from "@/components/orders";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Orders() {
  return <OrderPage />;
}

Orders.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;