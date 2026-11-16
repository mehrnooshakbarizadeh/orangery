import { Box, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import LatestTag from "../../LatestTag";
import HandleStatus from "../../organizer/organizer-preview/HandleStatus";
import ArrowRight from "../../ArrowRight";

export default function DefaultState({
  event,
  logDateTimeWeek,
}: {
  event: IEvent;
  logDateTimeWeek: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          gap: 2,
          flexDirection: "column",
          "& .date-block": { display: "flex", alignItems: "center", gap: 1 },
        }}
      >
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Date and Time
        </Typography>
        <span className="date-block">
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {new Date(event?.start_time).toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            })}
          </Typography>
          <ArrowRight />
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {new Date(event?.end_time).toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            })}
          </Typography>
        </span>
        <OrganizerRequest logDateTimeWeek={logDateTimeWeek} />
      </Box>
    </>
  );
}

const OrganizerRequest = ({
  logDateTimeWeek,
}: {
  logDateTimeWeek: IEventModification[];
}) => {
  return (
    <>
      {logDateTimeWeek.slice(0, 5).map((log, index) => (
        <Box
          key={log.uuid}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            flexGrow: 1,
            gap: 2,
            "& .title": { fontSize: "18px", fontWeight: 600, color: "#2B2E33" },
            "& .sub-title": {
              fontSize: "16px",
              fontWeight: 400,
              color: "#2B2E33",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography fontSize={17} fontWeight={600} color="#2B2E33">
                {new Date(log.datetime).toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Typography>
              {index === 0 && <LatestTag />}
              <HandleStatus status={log.status} modifiedBy={log.modified_by} />
              <ArrowRight />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              {log.column_name === "start_time" && (
                <Typography>{`Start time:  ${new Date(
                  log.new_value
                ).toLocaleString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hourCycle: "h24",
                })}`}</Typography>
              )}
              {log.column_name === "end_time" && (
                <Typography>{`End time:  ${new Date(
                  log.new_value
                ).toLocaleString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hourCycle: "h24",
                })}`}</Typography>
              )}
              {log.column_name === "weeks" && log.new_value > "1" ? (
                <Typography>{`Weekly:  ${log.new_value}`}</Typography>
              ) : (
                "One Time"
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
