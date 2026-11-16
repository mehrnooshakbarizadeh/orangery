// react & next
import { useState } from "react";

// external dependencies
import {
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";

// orangery elements & internal dependencies
import EditForm from "./EditForm";

// queries & backend
//

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";

export default function EditButton() {
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
            height: 488,
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <EditForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
