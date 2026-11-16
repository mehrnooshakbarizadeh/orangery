import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";
import { EventLogState } from "../HandleLogsRendering";

export default function HandleNameDescription({
  state,
  logNameDescription,
  event,
}: {
  state: EventLogState;
  logNameDescription: IEventModification[];
  event: IEvent;
}) {
  console.log(logNameDescription.length - 1);

  const nameValues = logNameDescription.filter(
    (sg) => sg.column_name === "name"
  );

  const nameValue =
    nameValues[0]?.status === "requested" ? nameValues[0].new_value : "";

  const descValues = logNameDescription.filter(
    (sg) => sg.column_name === "description"
  );
  const descValue =
    descValues[0]?.status === "requested" ? descValues[0]?.new_value : "";

  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: "#F9F9FA",
              border: "white",
              borderRadius: "10px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              <DefaultState
                event={event}
                logNameDescription={logNameDescription}
              />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  state={state}
                  event={event}
                  nameValue={nameValue}
                  descValue={descValue}
                  logNameDescription={logNameDescription}
                  disabled={!nameValue && !descValue}
                />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
