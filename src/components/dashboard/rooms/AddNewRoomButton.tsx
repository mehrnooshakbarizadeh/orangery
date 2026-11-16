// react & next
import React from "react";

// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies
import RoomForm from "./RoomForm";

// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewRoomButton() {
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
        <Typography className="add-btn">Add Room</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1263,
            minWidth: 1263,
            width: 1263,
            height: 747,
            minHeight: 747,
            borderRadius: '15px',
          }
        }}
      >
        <DialogContent sx={{
          height: 'calc(100% - 82px)',
          p: 0,
          // overflowY: "hidden"
        }}>
          {open && <RoomForm handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
