// react & next
import { useState } from "react";

// external dependencies
import { IconButton, Button, Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import DoorAccessOverviewContent from "./DoorAccessOverviewContent";

// queries & backend
import {
  IDoorAccess,
} from "../../../../../queries/apps/saltoKs";

// icons, images & colors
import ListCheckedIcon from "../../../assets/svg/list-checked.svg";

export default function DoorAccessOverviewButton({ doorAccess }: { doorAccess: IDoorAccess }) {
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
            maxWidth: 900,
            width: 900,
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
            <DoorAccessOverviewContent doorAccess={doorAccess} handleClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}