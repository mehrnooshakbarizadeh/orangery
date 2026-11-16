import { useEffect, useState } from "react";
import { EventFieldsState } from "./EventForm";
import { Box, IconButton, Typography } from "@mui/material";
import { Observer, observer } from "mobx-react-lite";
import PlusIcon from "../../../assets/svg/plus.svg";
import RefreshIcon from "../../../assets/svg/refresh.svg";
import RemoveIcon from "@mui/icons-material/Remove";
import { OrganizerEventFieldsState } from "./organizer/organizer-preview/OrganizerReviewPage";

interface DateArray extends Array<Date> {}

function* generateWeeklyDates(
  start: Date,
  // end: Date,
  weeks: number = 0
): IterableIterator<DateArray> {
  yield [start];

  for (let i = 0; i < weeks; i++) {
    start.setDate(start.getDate() + 7);
    // end.setDate(end.getDate() + 7);
    yield [new Date(start)];
  }
}

export default function WeeklyRepeat({
  value,
  onChange,
  state,
}: {
  value: number;
  onChange: (value: number) => void;
  state: EventFieldsState | OrganizerEventFieldsState;
}) {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const startDate = new Date(state.start_time.value);

    const dateGenerator = generateWeeklyDates(startDate, state.weeks.value);
    const dateList: string[] = [];
    for (const [start] of dateGenerator) {
      dateList.push(start.toISOString());
      setDates(dateList);
    }
  }, [state.start_time.value, state, state.weeks.value, state.end_time.value]);

  const handleDec = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };
  const handleInc = () => {
    onChange(value + 1);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        right: 0,
        width: "29%",
        display: "flex",
        flexDirection: "column",
        marginTop: "109px",
        gap: "16px",
        "& .plus-icon": {
          width: "0.8rem",
          height: "0.8rem",
          color: "#000",
        },
        "& .refresh-svg": {
          mr: "8px",
          width: "1rem",
          height: "1rem",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F9F9FA",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          height: "55px",
        }}
      >
        <RefreshIcon className="refresh-svg" />
        <Typography fontSize="13px" fontWeight={600} whiteSpace="nowrap">
          Repeat in weeks
        </Typography>
        <Observer>
          {() => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleDec}>
                <RemoveIcon className="plus-icon" />
              </IconButton>
              <Typography fontSize="14px" fontWeight={700}>
                {value}
              </Typography>
              <IconButton onClick={handleInc}>
                <PlusIcon className="plus-icon" />
              </IconButton>
            </Box>
          )}
        </Observer>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          flexDirection: "column",
          height: "92px",
        }}
      >
        <Observer>
          {() => (
            <>
              {dates.length > 3 ? (
                <>
                  {dates.slice(0, 3).map((date, index) => (
                    <DateRanges key={index} range={date} />
                  ))}
                  <Typography fontSize={13} fontWeight={600} color="#A5AAB4">
                    {`... and ${dates.length - 3} more day${
                      dates.length - 3 > 1 ? "s" : ""
                    }`}
                  </Typography>
                </>
              ) : (
                dates.map((date, index) => (
                  <DateRanges key={index} range={date} />
                ))
              )}
            </>
          )}
        </Observer>
      </Box>
    </Box>
  );
}

const DateRanges = observer(({ range }: { range: string }) => {
  return (
    <>
      <Observer>
        {() => (
          <Box sx={{ width: "100%" }}>
            <Typography>{new Date(range).toDateString()}</Typography>
          </Box>
        )}
      </Observer>
    </>
  );
});
