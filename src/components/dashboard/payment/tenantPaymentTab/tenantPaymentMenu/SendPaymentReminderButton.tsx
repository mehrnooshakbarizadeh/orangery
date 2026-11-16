// react & next
import { useState } from "react";

// external dependencies
import { Typography, Button, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import SendPaymentReminderForm from "./SendPaymentReminderForm";

// queries & backend
import { IBillingParams } from "../../../../../queries/billing";

export default function SendPaymentReminderButton({
  billing,
  icon
}: {
  billing: IBillingParams;
  icon: JSX.Element
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
        sx={{
          width: "100%",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirectio: "row",
          gap: 1,
          justifyContent: "left"
        }}
        onClick={() => handleOpen()}
      >
        {icon}
        <Typography variant="h5">Send Payment Reminder</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 400, width: 400 } }}
      >
        <DialogContent sx={{ p: 0, pb: 3 }}>
          {open && (
            <SendPaymentReminderForm
              billing={billing}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
