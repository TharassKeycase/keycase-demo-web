import React from "react";

import ProductPage from "@/components/products";
import Layout from "@/components/layouts/MainLayout";
import { requireAuth } from "@/lib/authHelpers";

export default function Products() {
  return <ProductPage />;
}

Products.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export const getServerSideProps = requireAuth;