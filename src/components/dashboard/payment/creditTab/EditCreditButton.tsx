// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// icons, images & colors
import PenIcon from "../../../../assets/svg/pen.svg";
import { ICredit } from "../../../../queries/credit";
import CreditForm from "./CreditForm";

export default function EditCreditButton({ credit }: { credit: ICredit }) {
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
          "& .icon": { width: "1.3rem", height: "1.3rem" },
          "&.MuiIconButton-root": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        <PenIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 429,
            height: 584,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <CreditForm credit={credit} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
