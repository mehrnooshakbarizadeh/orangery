import { Box, Typography } from "@mui/material";
import { IEvent } from "../../../../../queries/event";
import { OrangeryPrice } from "../../../../OrangeryElements";

export default function RoomPriceField({ event }: { event: IEvent }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          whiteSpace: "nowrap",
        }}
      >
        <Typography
          fontSize={18}
          fontWeight={700}
          color="#2B2E33"
          sx={{ display: "flex" }}
        >
          {`Count: ${event.meeting_rooms.length}`}
        </Typography>
        <Typography fontSize={18} fontWeight={700} color="#2B2E33">
          Price:
          <OrangeryPrice
            euro={event?.meeting_rooms.reduce(
              (acc, item) => acc + item.price,
              0
            )}
            germanFormat
          />
        </Typography>
      </Box>
    </>
  );
}
