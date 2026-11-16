// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import HandleOfferForm from "./HandleOfferForm";

// queries & backend
import { IOffer } from "../../../../queries/tenant";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";

export default function EditOfferButton({ offer }: { offer: IOffer }) {
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
          "& .MuiPaper-root": { minWidth: 1283, width: 1283, height: 845, minHeight: 845 },
        }}
      >
        <DialogContent sx={{ p: 0, height: 'calc(100% - 82px)' }}>
          {open && <HandleOfferForm offer={offer} handleClose={handleClose} handleDone={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
