// react & next
import { useState } from "react";

// external dependencies
import { IconButton, Button, Dialog, DialogContent } from "@mui/material";
import ListCheckedIcon from "../../../assets/svg/list-checked.svg";
import { IAutomation } from "../../../../../queries/apps/automations";
import AutomationOverviewContent from "./AutomationOverviewContent";

export default function AutomationOverviewDialog({
  automation,
  automationResult,
  handleClose,
  handleDone,
  open,
}: {
  automation: IAutomation;
  automationResult?: IAutomation;
  handleClose?: () => void;
  handleDone?: () => void;
  open?: boolean;
}) {
  return (
    <>
      <Dialog
        open={open!}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 720,
            width: 720,
            borderRadius: "15px",
            height: {
              xs: "none",
              sm: 960,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            height: "100%",
          }}
        >
          {open && (
            <AutomationOverviewContent
              automationResult={automationResult}
              automation={automation}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
