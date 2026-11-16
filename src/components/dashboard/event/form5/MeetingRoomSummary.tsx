import { Box, Typography } from "@mui/material";
import { OrangeryPrice } from "../../../OrangeryElements";
import { EventFieldsState } from "../EventForm";
import { Observer } from "mobx-react-lite";

export const MeetingRoomSummary = ({ state }: { state: EventFieldsState }) => {
  const timeCalc = () => {
    const start_time = new Date(state.start_time.value);
    const end_time = new Date(state.end_time.value);
    const diffInMs = end_time.getTime() - start_time.getTime();
    const diffInHours = diffInMs / 3600000;

    return diffInHours;
  };

  return (
    <Box
      sx={{
        pl: 4,
        pr: 3,
        "& .sub-row": { fontSize: "19px", fontWeight: 400, color: "#2B2E33" },
      }}
    >
      <Typography fontSize="20px" fontWeight={600} color="#A5AAB4" pt={1}>
        Meeting Rooms
      </Typography>
      {state.meeting_rooms.values?.map((mr) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                "&:first-letter": { textTransform: "capitalize" },
              }}
              fontSize="19px"
              fontWeight={600}
              flexGrow={1}
              color="#55585C"
            >
              {mr.value.name.value}
            </Typography>
            <Typography className="sub-row">{timeCalc()}/Hours</Typography>
            <Typography className="sub-row">
              {<OrangeryPrice euro={mr.value.price.value} germanFormat />}{" "}
            </Typography>
            <Observer>
              {() => (
                <Typography fontSize="19px" fontWeight={600} color="#0E0F11">
                  Total:{" "}
                  {
                    <OrangeryPrice
                      euro={timeCalc() * mr.value.price.value}
                      germanFormat
                    />
                  }
                </Typography>
              )}
            </Observer>
          </Box>
        </>
      ))}
    </Box>
  );
};
