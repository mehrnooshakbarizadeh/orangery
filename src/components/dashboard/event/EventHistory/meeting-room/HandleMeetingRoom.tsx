import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";
import PriceField from "./RoomPriceField";
import RoomPriceField from "./RoomPriceField";

export default function HandleMeetingRoom({
  logMeetingRoom,
  event,
}: {
  logMeetingRoom: IEventModification[];
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
              <DefaultState event={event} logMeetingRoom={logMeetingRoom} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  width: "350px",
                  justifyContent: "end",
                }}
              >
                <RoomPriceField event={event} />
                <EditButton
                  event={event}
                  logMeetingRoom={logMeetingRoom}
                  disabled={
                    logMeetingRoom[0]?.status === "requested" ? false : true
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
