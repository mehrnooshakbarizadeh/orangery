// contexts & globals
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
// import DeskForm from "./DeskForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";
import { SortState } from "./DesksList";
import { DeskForm } from "./DeskForm";

export default function AddNewDeskButton({ more }: { more?: boolean }) {
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
          {more ? "Add More Desks" : "Add Desk"}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: 1263,
            minWidth: 1263,
            // height: 586,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <DeskForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
