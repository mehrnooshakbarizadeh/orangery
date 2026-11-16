import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";
import { EventLogState } from "../HandleLogsRendering";

export default function HandleDateTime({
  logDateTimeWeek,
  state,
  event,
}: {
  state: EventLogState;
  logDateTimeWeek: IEventModification[];
  event: IEvent;
}) {
  const startTimeValues = logDateTimeWeek.filter(
    (sg) => sg.column_name === "start_time"
  );

  const startTimeValue =
    startTimeValues[0]?.status === "requested"
      ? startTimeValues[0]?.new_value
      : "";

  const endTimeValues = logDateTimeWeek.filter(
    (sg) => sg.column_name === "end_time"
  );
  const endTimeValue =
    endTimeValues[0]?.status === "requested" ? endTimeValues[0].new_value : "";

  const weekValues = logDateTimeWeek.filter((sg) => sg.column_name === "weeks");
  const weekValue =
    weekValues[0]?.status === "requested" ? Number(weekValues[0].new_value) : 0;
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
              <DefaultState event={event} logDateTimeWeek={logDateTimeWeek} />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  state={state}
                  event={event}
                  logDateTimeWeek={logDateTimeWeek}
                  startTimeValue={startTimeValue}
                  endTimeValue={endTimeValue}
                  weekValue={weekValue}
                  disabled={!startTimeValue && !endTimeValue && !weekValue}
                />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
