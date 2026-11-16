// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import HubSpotContactsList from "./HubSpotContactsList";

// queries & backend


// icons, images & colors



export default function HubSpotContactsListButton() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} sx={{ fontSize: 18, fontWeight: 600, height: 30 }}>
        User View
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>{open && <HubSpotContactsList handleClose={handleClose} />}</DialogContent>
      </Dialog >
    </>
  );
}
