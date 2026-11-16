// react & next
import React from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import GoogleAdminUsersDisconnectionForm from "../../googleAdminUsers/_connection/GoogleAdminUsersDisconnectionForm";

// queries & backend
import { IApp } from "../../../../../queries/apps";

// icons, images & colors
import RemoveIcon from "../../../../../assets/svg/remove.svg";

export default function GoogleAdminUsersDisconnectionButton({
  googleAdminUsers,
}: {
  googleAdminUsers: IApp;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return googleAdminUsers.integrated ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={handleOpen}
        // id={"desk_form_delete_div"}
        sx={{
          height: 30,
          px: 1,
          py: 0,
          // width: "fit-content",
          minWidth: 0,
          // gap: 1,
          // "& .icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        {/* <RemoveIcon className="icon" /> */}
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "red",
            lineHeight: 0,
          }}
        >
          Disconnect
        </Typography>
      </Button>

      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            height: 300,
            pt: 3,
            px: 4,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <GoogleAdminUsersDisconnectionForm handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  ) : (
    <></>
  );
}
