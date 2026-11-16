// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
// import DeskForm from "./DeskForm";

// queries & backend
import { IDesk } from "../../../queries/desk";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { SortState } from "./DesksList";
import { DeskForm } from "./DeskForm";

export default function EditDeskButton({
  desk,
  state,
}: {
  desk: IDesk;
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
            // height: 586,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <DeskForm desk={desk} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
