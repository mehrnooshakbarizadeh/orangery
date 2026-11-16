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
import DoorAccessForm from "./DoorAccessForm";

// queries & backend
import {
  IDoorAccess,
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import EditPenIcon from "../../../../../assets/svg/editPen.svg";

export default function EditDoorAccessButton({ doorAccess }: { doorAccess: IDoorAccess }) {
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
            maxWidth: 900,
            width: 900,
            maxHeight: {
              xs: "none",
              sm: 720
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <DoorAccessForm doorAccess={doorAccess} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
