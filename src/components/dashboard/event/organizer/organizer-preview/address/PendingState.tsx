import { useState } from "react";
import { IEvent, IOrganizerEvent } from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Typography } from "@mui/material";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <span>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Address
        </Typography>
        <Typography fontSize={22} fontWeight={700} color="#2B2E33">
          {event?.location ? event?.location : "-"}
        </Typography>
      </span>
    </>
  );
}
