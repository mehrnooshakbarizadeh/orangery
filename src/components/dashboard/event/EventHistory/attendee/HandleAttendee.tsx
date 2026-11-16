import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";

export default function HandleAttendee({
  logAttendee,
  event,
}: {
  logAttendee: IEventModification[];
  event: IEvent;
}) {
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
              <DefaultState event={event} logAttendee={logAttendee} />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  event={event}
                  logAttendee={logAttendee}
                  disabled={
                    logAttendee[0]?.status === "requested" ? false : true
                  }
                />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
