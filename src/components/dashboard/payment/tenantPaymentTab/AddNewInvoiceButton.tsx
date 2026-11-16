// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import InvoiceForm from "./tenantPaymentMenu/InvoiceForm";
import { OrangeryCloseButton } from "../../../OrangeryElements";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewInvoiceButton() {
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
          "& .add-btn": { fontSize: 18, fontWeight: 400, color: "#fff" },
          py: 1.5,
          px: 5,
          gap: "10px"
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Add Invoice</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 900,
            // height: 444,
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
          }}
        >
          {open &&
            <>
              <OrangeryCloseButton onClose={handleClose} />
              <InvoiceForm handleClose={handleClose} />
            </>
          }
        </DialogContent>
      </Dialog>
    </>
  );
}
