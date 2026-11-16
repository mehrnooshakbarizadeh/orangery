// contexts & globals

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import CreditForm from "./CreditForm";

export default function AddNewCreditButton() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          "& .add-title": { fontSize: 24, fontWeight: 400, color: "#fff" },
          "& .add-btn": { width: "1.3rem", height: "1.3rem", marginLeft: "-10px" },
          py: "12px",
          px: 5,
          gap: "10px",
          // color: (theme) => theme.palette.grey[200],
        }}
      >
        <PlusIcon className="add-btn" />
        <Typography className="add-title">Assign Credit</Typography>
      </Button>
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
          {open && <CreditForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
