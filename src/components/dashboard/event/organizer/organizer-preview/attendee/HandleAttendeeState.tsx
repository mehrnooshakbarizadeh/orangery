import { useState } from "react";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { Box, Button, Typography } from "@mui/material";
import { EventFieldsState } from "../../../EventForm";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import AcceptedState from "./AcceptedState";
import EditButton from "./EditButton";
import PendingState from "./PendingState";

export default function HandleAttendeeState({
  event,
  state,
  logAttendee,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
  logAttendee: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: state.resulAttendee ? "#E4F5E9" : "#F9F9FA",
          border: state.resulAttendee ? "1px solid #42B863" : "white",
          borderRadius: "15px",
          p: 3,
          display: "flex",
          justifyContent: "end",
          gap: 2.5,
        }}
      >
        {state.resulAttendee ? (
          <AcceptedState event={event} logAttendee={logAttendee} />
        ) : (
          <PendingState event={event} />
        )}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <EditButton event={event} state={state} />
        </Box>
      </Box>
    </>
  );
}
