// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import SettingsForm from "./SettingsForm";

// icons, images & colors
import SettingsIcon from "../../../../assets/svg/apps/osAnalytics/settings.svg";
import { IOffice } from "../../../../queries/office";

export default function SettingsButton({
  selectedOffice,
}: {
  selectedOffice?: IOffice;
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        disabled={!selectedOffice}
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          "& .icon": {
            width: 38,
          },
          width: 51,
          height: 40,
          ml: 2,
          backgroundColor: "#F9F9FA",
          // color: (theme) => theme.palette.grey[200],
        }}
      >
        <SettingsIcon className="icon" />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            // width: 1263,
            // minWidth: 1263,
            // height: 586,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <SettingsForm
              handleClose={handleClose}
              selectedOffice={selectedOffice}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
