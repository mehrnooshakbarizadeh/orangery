// react & next
import React, { useState } from "react";

// external dependencies
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

// orangery elements & internal dependencies
import OverviewContent from "./OverviewContent";

// queries & backend
import { IOffer, IOfferResult } from "../../../../../queries/tenant";

export default function OverviewDialog({
  overview,
}: {
  overview: IOfferResult;
}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": { maxWidth: 1100, width: 1051, height: 752 },
        }}
      >
        <DialogContent sx={{ "&.MuiDialogContent-root": { p: 0 } }}>
          {open && (
            <OverviewContent overview={overview} handleDone={handleClose} />
          )}
        </DialogContent>
      </Dialog>
      ;
    </>
  );
}
