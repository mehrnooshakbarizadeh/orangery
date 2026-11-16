// react & next
import { useState } from "react";

// external dependencies
import {
  Button,
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";

// orangery elements & internal dependencies
import RoomForm from "./RoomForm";

// queries & backend
import { IRoom } from "../../../queries/room";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";

export default function EditRoomButton({ room }: { room: IRoom }) {
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
          "& .icon": {
            color: "#000",
            width: "1.3rem",
            height: "1.3rem"
          },
        }}
      >
        <EditPenIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1263,
            minWidth: 1263,
            width: 1263,
            height: 747,
            borderRadius: '15px',
            minHeight: 747,
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <RoomForm room={room} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
