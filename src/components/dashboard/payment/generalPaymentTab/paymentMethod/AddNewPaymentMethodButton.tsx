// react & next
import React from "react";

// external dependencies
import { Box, Typography, Dialog, DialogContent, Button } from "@mui/material";

// orangery elements & internal dependencies
import PaymentMethodForm from "./PaymentMethodForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewPaymentMethodButton(props: any) { ////////!!!!!!!!
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "end" }}>
        <Button
          onClick={() => handleOpen()}
          sx={{
            color: "#074EE8",
            borderRadius: 3,
            textAlign: "right",
            px: 0.5,
            pr: 1,
            pt: 0.5,
            pb: 1,
            justifyContent: "end",
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              width: 20,
              height: 20,
              textAlign: "center"
            }}
          >
            <Box
              sx={{
                // marginTop: .3
              }}
            >
              <AddIcon />
            </Box>
          </Box>
          <Typography
            sx={{
              ml: 1,
              fontWeight: 700,
              fontSize: 16
            }}
          >
            {!props.editMode ? "Add new" : "Change"}
          </Typography>
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 900, width: 900 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <PaymentMethodForm handleClose={handleClose} buy={props.buy} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
