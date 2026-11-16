// react & next
import { useState } from "react";

// external dependencies
import { Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import FloorForm from "./FloorForm";

// queries & backend
import { IFloor } from "../../../queries/floor";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";

export default function EditFloorButton({ floor }: { floor: IFloor }) {
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
            maxWidth: 900,
            width: 900,
            // height: 330,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <FloorForm floor={floor} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
