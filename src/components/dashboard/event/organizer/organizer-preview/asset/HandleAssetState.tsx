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

export default function HandleAssetState({
  logAsset,
  event,
  state,
}: {
  logAsset: IEventModification[];
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resulAsset ? "#E4F5E9" : "#F9F9FA",
              border: state.resulAsset ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              {state.resulAsset && (
                <AcceptedState event={event} logAsset={logAsset} />
              )}
              {!state.resulAsset && <PendingState event={event} />}
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
