"use client";

import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Billing() {
  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold mb-7">
        Select Plan:
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <PricingTable />
      </div>
    </div>
  );
}

export default Billing;
