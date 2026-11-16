import { useEffect, useState } from "react";
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

export default function HandlePresenterState({
  logPresenter,
  event,
  state,
}: {
  logPresenter: IEventModification[];
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: state.resultPresenter ? "#E4F5E9" : "#F9F9FA",
              border: state.resultPresenter ? "1px solid #42B863" : "white",
              borderRadius: "15px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              {state.resultPresenter && (
                <AcceptedState event={event} logPresenter={logPresenter} />
              )}
              {!state.resultPresenter && <PendingState event={event} />}
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
