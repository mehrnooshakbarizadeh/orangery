import { useState } from "react";
import {
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
          Organizers -{" "}
          <span>{`${event?.organizers?.length} Person${
            event?.organizers?.length! > 1 ? "s" : ""
          }`}</span>
        </Typography>
        {event?.organizers?.map((organizer) => (
          <OrganizerInfo key={organizer.uuid} organizer={organizer} />
        ))}
      </Box>
    </>
  );
}

const OrganizerInfo = ({ organizer }: { organizer: IOrganizer }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {organizer.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {organizer.email}
        </Typography>
      </Box>
    </>
  );
};
