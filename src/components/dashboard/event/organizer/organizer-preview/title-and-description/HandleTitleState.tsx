import { useEffect, useState } from "react";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import TitleAndDescriptionAcceptedState from "./AcceptedState";
import TitleAndDescriptionPendingState from "./PendingState";
import { Box, Button, Typography } from "@mui/material";
import EditButton from "./EditButton";
import AcceptedState from "./AcceptedState";
import PendingState from "./PendingState";
import { EventFieldsState } from "../../../EventForm";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import { Observer } from "mobx-react-lite";

export default function HandleTitleState({
  logNameDescription,
  // logDesciptions,
  event,
  state,
}: {
  logNameDescription: IEventModification[];
  // logDesciptions: IEventModification[];
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resultTitle ? "#E4F5E9" : "white",
              border: state.resultTitle ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              {state.resultTitle && (
                <AcceptedState
                  event={event}
                  logNameDescription={logNameDescription}
                  // logDesciptions={logDesciptions}
                />
              )}
              {!state.resultTitle && <PendingState event={event} />}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton event={event} state={state} />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
