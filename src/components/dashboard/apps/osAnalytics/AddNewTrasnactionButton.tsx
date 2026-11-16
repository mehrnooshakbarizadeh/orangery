// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
//

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";
import AddNewTransactionForm from "./TransactionForm";
import { IOffice } from "../../../../queries/office";

export default function AddNewTransactionButton({
  selectedOffice
}: {
  selectedOffice?: IOffice;
}) {
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
          // color: (theme) => theme.palette.grey[200],
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">
          Add Transaction
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            // width: 1263,
            // minWidth: 1263,
            // height: 586,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <AddNewTransactionForm
            handleClose={handleClose}
            selectedOffice={selectedOffice}
          />}
        </DialogContent>
      </Dialog>
    </>
  );
}
