// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import DoorAccessForm from "./DoorAccessForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewDoorAccessButton() {
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
          gap: "10px"
          // color: (theme) => theme.palette.grey[200],
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">Add Door Access</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 900,
            maxHeight: {
              xs: "none",
              sm: 720
            }
          }
        }}
      >
        <DialogContent sx={{
          p: 0,
          overflowY: "hidden"
        }}>
          {open && <DoorAccessForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
