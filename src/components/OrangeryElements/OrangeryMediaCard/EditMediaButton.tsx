// react & next
import { useState } from "react";

// external dependencies
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";

//
import MediaForm from "../../dashboard/media/MediaForm";

//
import { IMedia } from "../../../queries/media";

// icons, images & colors
import PenIcon from "../../../assets/svg/editPen.svg";

export default function EditMediaButton({ media }: { media: IMedia }) {
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
          "& .icon": { width: "0.7rem", height: "0.7rem" },
          "&.MuiIconButton-root": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        <PenIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 900,
            width: 842,
            borderRadius: "15px",
            minWidth: 842
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {open && <MediaForm media={media} handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
