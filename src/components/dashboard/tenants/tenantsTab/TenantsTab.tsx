// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Tab, Tabs } from "@mui/material";

export default function TenantsTab() {
  const globalState = useGlobalState();

  return (
    <>
      Tenants
    </>
  );
}