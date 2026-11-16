// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import FloorForm from "./FloorForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewFloorButton({
  more
}: {
  more?: boolean
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
        }}
      >
        <AddIcon sx={{ marginLeft: "-10px" }} />
        <Typography className="add-btn">{more ? "Add More Floors" : "Add Floor"}</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 900,
            // height: 330,
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <FloorForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
