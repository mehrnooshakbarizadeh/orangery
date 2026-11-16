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

export default function HandleServiceState({
  logService,
  event,
  state,
}: {
  logService: IEventModification[];
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resulService ? "#E4F5E9" : "#F9F9FA",
              border: state.resulService ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              {state.resulService && (
                <AcceptedState event={event} logService={logService} />
              )}
              {!state.resulService && <PendingState event={event} />}
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
