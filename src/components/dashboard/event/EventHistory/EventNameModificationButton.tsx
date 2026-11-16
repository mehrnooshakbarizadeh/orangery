import { useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { IEvent } from "../../../../queries/event";
import { SortState } from "../EventList";
import EventModificationForm from "./EventModificationForm";

export default function EventNameModificationButton({
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
            width: 885,
            minWidth: 885,
            height: 713,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <EventModificationForm event={event} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
