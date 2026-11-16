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
import EditButton from "./EditButton";

export default function HandleMeetingRoomState({
  logMeetingRoom,
  event,
  state,
}: {
  logMeetingRoom: IEventModification[];
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resulMeetingRoom ? "#E4F5E9" : "#F9F9FA",
              border: state.resulMeetingRoom ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              {state.resulMeetingRoom && (
                <AcceptedState event={event} logMeetingRoom={logMeetingRoom} />
              )}
              {!state.resulMeetingRoom && <PendingState event={event} />}
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
