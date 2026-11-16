import { useState } from "react";
import {
  IEvent,
  IMeetingRoom,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Meeting Rooms
        </Typography>
        {event?.meeting_rooms?.map((mr) => (
          <MeetingRoomInfo key={mr.uuid} meetingRoom={mr} />
        ))}
      </Box>
    </>
  );
}

const MeetingRoomInfo = ({ meetingRoom }: { meetingRoom: IMeetingRoom }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {meetingRoom.name}
        </Typography>
      </Box>
    </>
  );
};
