import { useState } from "react";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { Box, Button, Typography } from "@mui/material";
import AcceptedState from "./AcceptedState";
import PendingState from "./PendingState";
import EditButton from "./EditButton";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";

export default function HandleAddressState({
  event,
  state,
  logAddressLink,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
  logAddressLink: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: state.resultAddress ? "#E4F5E9" : "#F9F9FA",
          border: state.resultAddress ? "1px solid #42B863" : "white",
          borderRadius: "15px",
          p: 3,
          display: "flex",
          justifyContent: "end",
          gap: 2.5,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {state.resultAddress ? (
            <AcceptedState event={event} logAddressLink={logAddressLink} />
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
