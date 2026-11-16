// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Paper, Typography } from "@mui/material";

// orangery elements & internal dependencies
import ReportsTable from "./ReportsTable";
import AllLocationsReportsTable from "./AllLocationsReportsTable";
import FinancialReportsTab from "./FinancialReportsTab";

import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryTabs,
} from "../../OrangeryElements";

// queries & backend

export default function ReportsNav() {
  useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor =
      "white";
    document.querySelector<HTMLInputElement>("main")!.style.overflowX =
      "hidden";
  }, []);

  const globalState = useGlobalState();
  const office = globalState.currentOffice;

  const user = globalState.currentUser;

  const tabs = [
    {
      label: "Current Location Reports",
      content: <ReportsTable />,
    },
    ...(!globalState.currentOffice?.is_customer
      ? [
        {
          label: "All Locations Reports",
          content: <AllLocationsReportsTable />,
        },
        {
          label: "Financial Reports",
          content: <FinancialReportsTab />,
        },
      ]
      : []),
  ];

  return office ? (
    <OrangeryTabs
      tabs={tabs}
    />
  ) : (
    <></>
  );
}
