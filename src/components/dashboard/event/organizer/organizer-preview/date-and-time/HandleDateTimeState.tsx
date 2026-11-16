import { useState } from "react";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { Box, Button, Typography } from "@mui/material";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import AcceptedState from "./AcceptedState";
import PendingState from "./PendingState";
import EditButton from "./EditButton";

export default function HandleDateTimeState({
  event,
  state,
  logDateTime,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
  logDateTime: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: state.resultDateTime ? "#E4F5E9" : "#F9F9FA",
          border: state.resultDateTime ? "1px solid #42B863" : "white",
          borderRadius: "15px",
          p: 3,
          display: "flex",
          justifyContent: "end",
          gap: 2.5,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {state.resultDateTime ? (
            <AcceptedState event={event} logDateTime={logDateTime} />
          ) : (
            <PendingState event={event} />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <EditButton event={event} state={state} />
        </Box>
      </Box>
    </>
  );
}
