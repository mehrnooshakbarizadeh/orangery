import { useState } from "react";
import {
  IEvent,
  IEventService,
  IMeetingRoom,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import {
  OrangeryCarousel,
  OrangeryTextAreaField,
} from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";

export default function PendingState({
  event,
  state,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4" mb={2}>
          Optional Note
        </Typography>
        <Observer>
          {() => (
            <OrangeryTextAreaField
              sx={{
                width: "100%",
                height: "118px",
                mb: 4,
              }}
              editorHeight="5.9rem"
              name="description"
              multiline
              placeholder="Write somthing about the event"
              error={!!state.organizer_note.error}
              value={state.organizer_note.value}
              helperText={state.organizer_note.error}
              onChange={(e: any) =>
                (state.organizer_note.value = e.target.value)
              }
            />
          )}
        </Observer>
      </Box>
    </>
  );
}
