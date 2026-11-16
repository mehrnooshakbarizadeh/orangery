// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies


// queries & backend
import { IAutomation } from "../../../../queries/apps/automations";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import { SortAutomationState } from "./AutomationsList";
import AutomationForm from "./AutomationForm";
import Router from "next/router";

export default function EditAutomationButton({
  automation,
  state,
}: {
  state?: SortAutomationState;
  automation: IAutomation;
}) {

  return (
    <>
      <IconButton
        onClick={() => Router.push(`/dashboard/apps/automations/?id=${automation.uuid}`)}
        sx={{
          "& > *:first-of-type": { mx: 0 },
          color: "grey.A700",
          "& .edit-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <EditPenIcon className="edit-icon" />
      </IconButton>
    </>
  );
}
