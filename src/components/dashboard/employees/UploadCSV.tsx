// contexts & globals
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { EmployeeForm } from "./EmployeeForm";

// icons, images & colors
import CSVIcon from "../../../assets/svg/csv.svg";
import { EmployeeSortState } from "./EmployeesList";
import { CSVForm } from "./CSVForm";

export default function UploadCSV({
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
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          backgroundColor: "#fff",
          "& .add-btn": { fontSize: 20, fontWeight: 400, whiteSpace: "nowrap" },
          "& .csv-icon": { width: "1.8rem", height: "1.8rem" },
          py: "10.75px",
          px: 3,
          gap: "20px",
          borderRadius: "5px",
          color: "#000",
          border: "1px solid #000",
          boxShadow: "none",
          "&:hover": { backgroundColor: "#fff !important", boxShadow: "none" },
        }}
      >
        <CSVIcon className="csv-icon" />
        <Typography className="add-btn">Import file</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 700,
            minWidth: 700,
            width: 700,
            borderRadius: 3,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <CSVForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
