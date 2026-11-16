// react & next
import React, { useState } from "react";
import ReviewIcon from "../../../../assets/svg/content-management-review.svg";

// external dependencies
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies

// queries & backend
import { IPublishedContent } from "../../../../queries/content-management";
import ReportedOverviewContent from "./ReportedOverviewContent";
import { BlockReportedState } from "./ReportedContentTab";

export default function ReportedOverviewDialog({
  overview,
  blockState,
}: {
  overview: IPublishedContent;
  blockState: BlockReportedState;
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
      <Button
        sx={{
          py: 1,
          gap: 1,
          height: "32px",
          // flex: 1,
          "&.MuiButton-root": { px: "10px" },
          "& .icon": { width: "1rem", height: "1rem" },
          "& .add-btn": { fontSize: 14, fontWeight: 600, color: "#fff" },
        }}
        variant="contained"
        onClick={handleOpen}
      >
        <ReviewIcon className="icon" />
        <Typography className="add-btn">Review</Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1262,
            width: 1262,
            height: 752,
            borderRadius: "15px",
          },
        }}
      >
        <DialogContent sx={{ "&.MuiDialogContent-root": { p: 0 } }}>
          {open && (
            <ReportedOverviewContent
              overview={overview}
              handleClose={handleClose}
              blockState={blockState}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
