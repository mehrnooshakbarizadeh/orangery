import { useState } from "react";
import {
  IAttendee,
  IEvent,
  IOrganizer,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Attendees -{" "}
          <span>{`${event?.attendees?.length} Person${
            event?.attendees?.length! > 1 ? "s" : ""
          }`}</span>
        </Typography>
        {event?.attendees?.map((attendee) => (
          <OrganizerInfo key={attendee.uuid} attendee={attendee} />
        ))}
      </Box>
    </>
  );
}

const OrganizerInfo = ({ attendee }: { attendee: IAttendee }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {attendee.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {attendee.email}
        </Typography>
      </Box>
    </>
  );
};
