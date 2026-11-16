import { useState } from "react";
import { IEvent, IOrganizerEvent } from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1, display: "flex", gap: 4 }}>
        <OrangeryCarousel images={event?.images?.map((image) => image.uuid)} />
        <span>
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {event?.name}
          </Typography>
          <Typography fontSize={16} fontWeight={400} color="#2B2E33">
            {event?.description}
          </Typography>
        </span>
      </Box>
    </>
  );
}
