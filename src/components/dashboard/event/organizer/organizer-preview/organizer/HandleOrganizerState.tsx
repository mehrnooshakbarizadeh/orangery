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
import PendingState from "./PendingState";
import EditButton from "./EditButton";

export default function HandleOrganizerState({
  event,
  state,
  logOrganizers,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
  logOrganizers: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: state.resultOrganizer ? "#E4F5E9" : "#F9F9FA",
          border: state.resultOrganizer ? "1px solid #42B863" : "white",
          borderRadius: "15px",
          p: 3,
          display: "flex",
          justifyContent: "end",
          gap: 2.5,
        }}
      >
        {state.resultOrganizer ? (
          <AcceptedState event={event} logOrganizers={logOrganizers} />
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
