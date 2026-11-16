// contexts & globals
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { EmployeeForm } from "./EmployeeForm";

// icons, images & colors
import AddIcon from "../../../assets/svg/plus.svg";
import { EmployeeSortState } from "./EmployeesList";

export default function AddNewEmployeeButton({
  employeeSortState,
}: {
  employeeSortState?: EmployeeSortState;
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
          "& .add-btn": { fontSize: 20, fontWeight: 400, color: "#fff" },
          "& .plus-icon": { width: "1.5rem", height: "1.56rem" },
          py: "12px",
          px: 5,
          gap: "10px",
        }}
      >
        <AddIcon className="plus-icon" />
        <Typography className="add-btn">Add Employee</Typography>
      </Button>
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
          {open && <EmployeeForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
