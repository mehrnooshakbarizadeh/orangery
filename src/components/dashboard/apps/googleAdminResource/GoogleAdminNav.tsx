// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies

// orangery elements & internal dependencies
import ImportForm from "./ImportForm";
import ExportForm from "./ExportForm";
import { OrangeryTabs } from "../../../OrangeryElements";

// queries & backend

export default function GoogleAdminNav() {
  useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor =
      "white";
  }, []);
  const globalState = useGlobalState();
  const office = globalState.currentOffice;

  const user = globalState.currentUser;

  const tabs = [
    { label: "Import", content: <ImportForm /> },
    {
      label: "Export",
      content: <ExportForm />,
    },
  ];

  return office ? <OrangeryTabs tabs={tabs} /> : <></>;
}
