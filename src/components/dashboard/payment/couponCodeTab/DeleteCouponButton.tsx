import { useState } from "react";
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import RemoveIcon from "../../../../assets/svg/remove.svg";
import { ICoupon, useDeleteCoupon } from "../../../../queries/coupon";
import { OrangeryText, OrangeryToast } from "../../../OrangeryElements";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

export default function DeleteCouponButton({
  handleCloseForm,
  coupon,
  sx,
  label,
}: {
  handleCloseForm: () => void;
  label?: React.ReactNode;
  coupon: ICoupon;
} & ButtonProps) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeleteCoupon();
  const [open, setOpen] = useState(false);
  const handleDelete = () => {
    mutation.mutate({
      office_uuid: office_uuid,
      uuid: coupon.uuid,
    });
    OrangeryToast("Deleted " + coupon.discount_code, "warning");
    handleCloseForm();
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        disabled={mutation.isLoading}
        // id={"desk_form_delete_div"}
        sx={{
          ...sx,
          gap: 1,
          "& .delete-icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <RemoveIcon className="delete-icon" />
        <Typography variant="h5">{label}</Typography>
      </Button>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            width: 440,
            height: "auto",
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ fontSize: 30, fontWeight: 600, wordBreak: "break-word" }}
        >
          Delete Coupon <OrangeryText text={coupon?.discount_code} limit={50} />
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this coupon?</Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 7 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "grey.200",
                color: "grey.A200",
                fontSize: 21,
                fontWeight: 400,
                flexGrow: 1,
                width: 170,
                height: 55,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{
                fontSize: 21,
                fontWeight: 400,
                color: "#fff",
                width: 170,
                height: 55,
              }}
              onClick={handleDelete}
            >
              Yes, Remove it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
