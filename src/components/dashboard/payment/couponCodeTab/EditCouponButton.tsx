// react & next
import { useState } from "react";

// external dependencies
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import { ICoupon } from "../../../../queries/coupon";
import CouponForm from "./CouponForm";

export default function EditDeskButton({ coupon }: { coupon: ICoupon }) {
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
        sx={{ "& .MuiPaper-root": { maxWidth: 1263,
          width: 1263,
          minWidth: 1263, 
        } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <CouponForm coupon={coupon} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
