// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import EmbedMeetingRoomsForm from "./EmbedMeetingRoomsForm";

// icons, images & colors
import EmbedIcon from "../../../assets/svg/embed-icon.svg";

export default function EmbedMeetingRoomButton() {
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
        // border = "1px solid #2B2E33";
        variant="outlined"
        onClick={() => handleOpen()}
        sx={{
          color: "#2B2E33",
          backgroundColor: "white",
          py: "12px",
          px: 2,
          gap: "10px",
        }}
      >
        <EmbedIcon sx={{ marginLeft: "-10px" }} />
        <Typography
          sx={{ fontSize: 18, fontWeight: 400 }}
        >
          Embed
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 720,
            width: 720,
            borderRadius: 4
          },
        }}
      >
        <DialogContent sx={{
          p: 0,
        }}>
          {open && <EmbedMeetingRoomsForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
