import { useState } from "react";
import { IEvent, IOrganizerEvent } from "../../../../../../queries/event";
import { Box, Typography } from "@mui/material";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <span>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Date and Time
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography fontSize={22} fontWeight={700} color="#2B2E33">
            {new Date(event?.start_time!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            })}
          </Typography>
          <Box
            sx={{
              height: "21px",
              "& .arrow-icon": { width: "1rem", height: "1rem" },
            }}
          >
            <ArrowRightIcon className="arrow-icon" />
          </Box>
          <Typography fontSize={22} fontWeight={700} color="#2B2E33">
            {new Date(event?.end_time!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            })}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              ml: "113px",
            }}
          >
            <Box>
              <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
                Recurring
              </Typography>
              <Typography>
                {event?.is_weekly ? (
                  <Typography
                    fontSize={19}
                    fontWeight={600}
                    sx={{ "& .repeat": { fontSize: "12px", fontWeight: 400 } }}
                  >
                    Weekly
                    <span className="repeat">
                      {` (Repeat for ${event.weeks} week${
                        event.weeks! > 1 ? "s" : ""
                      })`}
                    </span>
                  </Typography>
                ) : (
                  "One time"
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      </span>
    </>
  );
}
