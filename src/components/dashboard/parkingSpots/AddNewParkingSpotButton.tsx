// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import ParkingSpotForm from "./ParkingSpotForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";
import { Observer } from "mobx-react-lite";

export default function AddNewParkingSpotButton() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Observer>
      {() => (
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
            <Typography className="add-btn">Add Parking Spot</Typography>
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                maxWidth: 1137,
                minWidth: 1137,
                width: 1137,
              },
            }}
          >
            <DialogContent sx={{ p: 0 }}>
              {open && <ParkingSpotForm handleClose={handleClose} />}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Observer>
  );
}
