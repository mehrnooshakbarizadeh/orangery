// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// icons, images & colors
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import { IBankAccount } from "../../../../queries/bankAccount";
import BankAccountForm from "./BankAccountForm";

export default function EditBankAccountButton(
  {
    bankAccount
  }: {
    bankAccount: IBankAccount
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
      <IconButton
        onClick={() => handleOpen()}
        sx={{
          "& .icon": {
            color: "#000",
            width: "1.3rem",
            height: "1.3rem"
          },
        }}
      >
        <EditPenIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 900, width: 900, height: 500 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <BankAccountForm bankAccount={bankAccount} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
