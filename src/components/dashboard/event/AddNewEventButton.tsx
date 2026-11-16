import React from "react";
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";
import EventForm from "./EventForm";
import EventIcon from "../../../assets/svg/event-btn.svg";

export default function AddNewEventButton({ more }: { more?: boolean }) {
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
          "& .add-btn": { fontSize: 22, fontWeight: 400, color: "#fff" },
          py: "11px",
          pl: 3,
          pr: 2,
          gap: "10px",
        }}
      >
        <EventIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Create an Event</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: 1263,
            minWidth: 1263,
            height: 980,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <EventForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
