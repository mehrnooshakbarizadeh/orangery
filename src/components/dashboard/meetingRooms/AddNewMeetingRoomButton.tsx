import React from "react";
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HandleRoomForm from "./HandleRoomForm";

export default function AddNewMeetingRoomButton() {
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
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          "& .add-btn": { fontSize: 18, fontWeight: 400, color: "#fff" },
          py: "12px",
          px: 5,
          gap: "10px",
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Add Meeting Rooms</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1263,
            width: 1263,
            height: 974,
            minHeight: 974,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <HandleRoomForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
