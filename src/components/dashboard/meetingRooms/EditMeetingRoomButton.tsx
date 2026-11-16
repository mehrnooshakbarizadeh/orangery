import { useState } from "react";
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

import { IMeetingRoom } from "../../../queries/meetingRoom";
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { SortMeetingRoomState } from "./MeetingRoomsList";
import HandleRoomForm from "./HandleRoomForm";

export default function EditMeetingRoomButton({
  meetingRoom,
  state,
}: {
  state: SortMeetingRoomState;
  meetingRoom: IMeetingRoom;
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
          {open && (
            <HandleRoomForm
              meetingRoom={meetingRoom}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
