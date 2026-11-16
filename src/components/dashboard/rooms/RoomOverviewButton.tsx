// react & next
import { useState } from "react";

// external dependencies
import { IconButton, Button, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import RoomOverviewContent from "./preview/RoomOverviewContent";

// queries & backend
import { IRoom } from "../../../queries/room";

// icons, images & colors
import ListCheckedIcon from "../../../assets/svg/list-checked.svg";

export default function RoomOverviewButton({ room }: { room: IRoom }) {
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
          "& > *:first-of-type": { mx: 0 },
          "& .ListCheckedIcon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <ListCheckedIcon className="ListCheckedIcon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1100,
            width: 1100,
            height: {
              xs: "none",
              sm: 720,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            height: "100%",
          }}
        >
          {open && (
            <RoomOverviewContent room={room} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
