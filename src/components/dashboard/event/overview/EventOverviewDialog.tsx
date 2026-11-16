// react & next
import { useState } from "react";

// external dependencies
import { IconButton, Button, Dialog, DialogContent } from "@mui/material";
import ListCheckedIcon from "../../../assets/svg/list-checked.svg";
import { IEvent, IEventResult } from "../../../../queries/event";
import EventOverviewContent from "./EventOverviewContent";

export default function EventOverviewDialog({
  event,
  eventResult,
  handleClose,
  handleDone,
  open,
}: {
  event: IEvent;
  eventResult?: IEventResult;
  handleClose?: () => void;
  handleDone?: () => void;
  open?: boolean;
}) {
  return (
    <>
      <Dialog
        open={open!}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: 1262,
            width: 1262,
            borderRadius: "15px",
            height: {
              xs: "none",
              sm: 960,
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
            <EventOverviewContent
              eventResult={eventResult}
              event={event}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
