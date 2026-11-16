// react & next
import React, { useEffect } from "react";

// external dependencies
import { Dialog, DialogContent } from "@mui/material";

// orangery elements & internal dependencies

// icons, images & colors
import QuickStartForm from "./HandleFloorView";

export default function QuickstartDialog({
  onClose,
  isQuickTrue,
}: {
  isQuickTrue?: boolean;
  onClose?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (isQuickTrue) {
      setOpen(true);
    } else setOpen(false);
  }, [isQuickTrue]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#F9F9FA",
            maxWidth: "1076px",
            width: "1076px",
            borderRadius: "20px",
            // height: 330,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <QuickStartForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}
