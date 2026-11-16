// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

// orangery elements & internal dependencies
import ParkingSpotForm from "./ParkingSpotForm";

// queries & backend
import { IParkingSpot } from "../../../queries/parkingSpot";

// icons, images & colors
import EditPenIcon from "../../../assets/svg/editPen.svg";

export default function EditParkingSpotButton({
  parkingSpot,
}: {
  parkingSpot: IParkingSpot;
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
          "& > *:first-child": { mx: 0 },
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
            maxWidth: 1137,
            minWidth: 1137,
            width: 1137,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <ParkingSpotForm
              parkingSpot={parkingSpot}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
