// contexts & globals
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Typography } from "@mui/material";

// orangery elements & internal dependencies
import VisitorForm from "./VisitorForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";
import { VisitorSortState } from "./VisitorsList";

export default function AddNewVisitorButton() {
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
          "& .add-btn": { fontSize: 24, fontWeight: 400, color: "#fff" },
          py: "10px",
          px: 5,
          gap: "10px",
          // color: (theme) => theme.palette.grey[200],
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Add Visitor</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "1263px",
            width: "1263px",
            // height: 650
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <VisitorForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
