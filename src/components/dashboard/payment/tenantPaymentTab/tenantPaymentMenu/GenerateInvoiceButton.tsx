// react & next
import { useState } from "react";

// external dependencies
import { Typography, Button, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import GenerateInvoiceForm from "./GenerateInvoiceForm";

// queries & backend
import { IBillingParams } from "../../../../../queries/billing";

// icons, images & colors
//

export default function GenerateInvoiceButton({
  billing,
  icon
}: {
  billing: IBillingParams;
  icon?: JSX.Element
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
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
          justifyContent: "left"
        }}
        onClick={() => handleOpen()}
      >
        {icon}
        <Typography variant="h5">Generate Invoice</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 400, width: 400 } }}
      >
        <DialogContent sx={{ p: 0, pb: 3 }}>
          {open && (
            <GenerateInvoiceForm
              billing={billing}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
