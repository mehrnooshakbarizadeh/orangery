// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import PlanSubscriptionForm from "./PlanSubscriptionForm";

// queries & backend
import {
  IPlan,
} from "../../../../../queries/plan";
import {
  IPaymentMethod,
} from "../../../../../queries/paymentMethod";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";

export default function SubscribePlanButton({
  plan,
  paymentMethod
}: {
  plan: IPlan;
  paymentMethod?: IPaymentMethod
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          width: "100%",
          height: 55,
          fontSize: 20,
          color: "#fff",
        }}
      >
        PURCHASE NOW
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 900, width: 900, height: "fit-content", p: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <PlanSubscriptionForm
              plan={plan}
              paymentMethod={paymentMethod}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
