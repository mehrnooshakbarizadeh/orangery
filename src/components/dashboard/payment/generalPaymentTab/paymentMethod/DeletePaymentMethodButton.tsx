// react & next
import { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryToast
} from "../../../../OrangeryElements";

// queries & backend
import {
  IDeletePaymentMethodParams,
  useDeletePaymentMethod,
} from "../../../../../queries/paymentMethod";

// icons, images & colors
import RemoveIcon from "../../../../../assets/svg/remove.svg";

export default function DeletePaymentMethodButton({
  sx,
  label,
  paymentMethod,
  onDelete,
}: {
  onDelete: () => void;
  label: string;
  paymentMethod: IDeletePaymentMethodParams;
} & ButtonProps) {
  const [open, setOpen] = useState(false);
  const mutation = useDeletePaymentMethod();
  const handleDelete = () => {
    mutation.mutate({
      // number: paymentMethod.number,
      // exp_month: paymentMethod.exp_month,
      // exp_year: paymentMethod.exp_year,
      // cvc: paymentMethod.cvc,
      // name: paymentMethod.name,
      last4: paymentMethod.last4,
    });
    handleClose();
    onDelete();
    if (!mutation.isError)
      OrangeryToast("Deleted " + paymentMethod.last4, "warning");
    else
      OrangeryToast("Deletion failed!", "warning");
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
        sx={{
          ...sx,
          gap: 1,
          "& .delete-icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <RemoveIcon className="delete-icon" />
        <Typography variant="h5" color="red">
          {label}
        </Typography>
      </Button>
      <Dialog
        maxWidth="xs"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3.8,
            // width: 440,
            // height: 304,
            pt: 3,
            px: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 30, fontWeight: 600 }}>
          Remove {paymentMethod.last4}
        </DialogTitle>
        <DialogContent>
          <Typography>
            By removing this Payment Method, it will be inaccessible.
          </Typography>
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
