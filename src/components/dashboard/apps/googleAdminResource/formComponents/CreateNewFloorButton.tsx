// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import FloorForm from "../../../floors/FloorForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function CreateNewFloorButton({
  officeUuid,
}: {
  officeUuid: string;
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
        onClick={() => handleOpen()}
        sx={{
          backgroundColor: "#F9D507",
          width: "100%",
          borderRadius: "10px",
          fontSize: 12,
          fontWeight: 700,
          color: "#2B2E33",
        }}
      >
        Create New Floor
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 900,
            // height: 330,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && (
            <FloorForm officeUuid={officeUuid} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
