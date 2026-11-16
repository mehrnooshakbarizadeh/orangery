// contexts & globals
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import CustomerForm from "./CustomerForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewCustomerButton() {
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
          py: "12px",
          px: 5,
          gap: "10px",
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Add Customer</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1263,
            width: 1263,
            minWidth: 1263,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <CustomerForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
