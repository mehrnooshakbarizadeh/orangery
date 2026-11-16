// react & next
import { useState } from "react";

// external dependencies
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies

// queries & backend
import { IEmployee } from "../../../queries/employee";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";
import { EmployeeSortState } from "./EmployeesList";
import { EmployeeForm } from "./EmployeeForm";

export default function EditDeskButton({
  employee,
  disabled,
}: {
  employee: IEmployee;
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
            maxWidth: 1262,
            minWidth: 1262,
            width: 1262,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <EmployeeForm employee={employee} handleClose={handleClose}/>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
