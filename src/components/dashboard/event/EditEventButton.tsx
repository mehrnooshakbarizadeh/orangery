import { useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { SortState } from "./EventList";
import EventForm from "./EventForm";
import { IEvent } from "../../../queries/event";

export default function EditEventButton({
  event,
  state,
}: {
  event: IEvent;
  state?: SortState;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        onClick={() => handleOpen()}
        sx={{
          "& > *:first-of-type": { mx: 0 },
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
          {open && <EventForm event={event} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
