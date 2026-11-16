// contexts & globals

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import CouponForm from "./CouponForm";

export default function AddNewCouponButton() {
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
        <Typography className="add-title">Add Coupon</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1263,
            width: 1263,
            minWidth: 1263,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <CouponForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
