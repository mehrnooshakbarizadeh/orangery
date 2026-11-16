import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { Box, Button, Typography } from "@mui/material";
import { EventFieldsState } from "../../../EventForm";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import { Observer } from "mobx-react-lite";
import AcceptedState from "./AcceptedState";
import PendingState from "./PendingState";
import EditButton from "./ActionButtons";
import ActionButtons from "./ActionButtons";

export default function HandleNoteState({
  event,
  state,
}: {
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resulNote ? "#E4F5E9" : "#F9F9FA",
              border: state.resulNote ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <>
              <PendingState event={event} state={state} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  justifyContent: "end",
                }}
              >
                <ActionButtons event={event} state={state} />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
