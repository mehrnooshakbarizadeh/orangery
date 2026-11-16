// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";

// external dependencies
import { Box, Paper, Typography } from "@mui/material";

// orangery elements & internal dependencies
import OfficeForm from "./officeSettingsTab/OfficeForm";
import EmailForm from "./emailSettingsTab/EmailForm";
import OfficeGuidelineForm from "./officeGuidelineTab/OfficeGuidelineForm";
import {
  OrangeryTabs,
} from "../../OrangeryElements";
import { useOffices } from "../../../queries/office";
import ServicePartnersList from "./servicePartnersTab/ServicePartnersList";

// queries & backend

export default function SettingsNav() {
  useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor =
      "white";
  }, []);
  const globalState = useGlobalState();
  const office = globalState.currentOffice;
  const currentOfficeId = office.uuid;
  const { data: offices } = useOffices();
  const currentOfficeViewToken = offices
    ?.filter((office) => office.uuid === currentOfficeId)
    .map((x) => x.view_token);

  const user = globalState.currentUser;

  const tabs = [
    ...(user?.group.name === "space_admin" || user?.group.name === "owner"
      ? [
        {
          label: "Office Settings",
          content: (
            <OfficeForm
              office={{
                uuid: office?.uuid,
                name: office?.name,
                address: office?.address,
                phone: office?.phone,
                community_manager_phone: office?.community_manager_phone,
                email: office?.email,
                tax_rate: office?.default_tax_rate,
                data: office?.data,
                opening_times: office?.opening_times,
                view_token: currentOfficeViewToken?.toString(),
              }}
            />
          ),
        },
      ]
      : []),
    {
      label: "Email Settings",
      content: <EmailForm />,
    },
    {
      label: "Office guideline",
      content: <OfficeGuidelineForm />,
    },
    ...((user?.group.name === "space_admin" || user?.group.name === "owner") && !globalState.currentOffice?.is_customer
      ? [
        {
          label: "Service Partners",
          content: <ServicePartnersList />
        },
      ]
      : []),
  ];

  return office ? <OrangeryTabs tabs={tabs} /> : <></>;
}
