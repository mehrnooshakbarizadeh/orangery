import { useState } from "react";
import {
  IEvent,
  IEventService,
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
          Services
        </Typography>
        {event?.services?.map((se) => (
          <ServiceInfo key={se.uuid} service={se} />
        ))}
      </Box>
    </>
  );
}

const ServiceInfo = ({ service }: { service: IEventService }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {service.service_name}
        </Typography>
      </Box>
    </>
  );
};
