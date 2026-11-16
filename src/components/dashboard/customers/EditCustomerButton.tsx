// react & next
import { useState } from "react";

// external dependencies
import { Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import CustomerForm from "./CustomerForm";

// queries & backend
import { ICustomer } from "../../../queries/customer";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";

export default function EditCustomerButton({
  customer,
  disabled,
}: {
  customer: ICustomer;
  disabled?: boolean;
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
        disabled={disabled}
        onClick={() => handleOpen()}
        sx={{
          "& > *:first-of-type": { mx: 0 },
          "& .edit-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <EditPenIcon className="edit-icon" />
      </IconButton>
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
          {open && (
            <CustomerForm customer={customer} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
