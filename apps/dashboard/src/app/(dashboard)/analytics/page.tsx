import React from "react";
import AnalyticsClientPage from "./analytic-client";
import { getCategories, getTransactions } from "@/lib/core/queries";

export default async function AnalyticsPage() {
  const [trans, cats] = await Promise.all([getTransactions(), getCategories()]);

  return <AnalyticsClientPage trans={trans} cats={cats} />;
}
