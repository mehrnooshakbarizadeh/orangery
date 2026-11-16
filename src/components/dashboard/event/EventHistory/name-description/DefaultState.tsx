import { Box, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import LatestTag from "../../LatestTag";
import HandleStatus from "../../organizer/organizer-preview/HandleStatus";
import ArrowRight from "../../ArrowRight";

export default function DefaultState({
  event,
  logNameDescription,
}: {
  event: IEvent;
  logNameDescription: IEventModification[];
}) {
  console.log(logNameDescription);
  return (
    <>
      <Box
        sx={{ flexGrow: 1, display: "flex", gap: 2, flexDirection: "column" }}
      >
        <span>
          <Typography fontSize={31} fontWeight={700} color="#2B2E33">
            {event.name}
          </Typography>
          <Typography fontSize={16} fontWeight={400} color="#2B2E33">
            {event.description}
          </Typography>
        </span>
        <OrganizerRequest logNameDescription={logNameDescription} />
      </Box>
    </>
  );
}

const OrganizerRequest = ({
  logNameDescription,
}: {
  logNameDescription: IEventModification[];
}) => {
  return (
    <>
      {logNameDescription.slice(0, 5).map((log, index) => (
        <Box
          key={log.uuid}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            flexGrow: 1,
            gap: 2,
            "& .title": { fontSize: "22px", fontWeight: 700, color: "#2B2E33" },
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
            {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {log.column_name === "name" ? (
                <Typography className="title">{log.new_value}</Typography>
              ) : (
                <Typography className="sub-title">{log.new_value}</Typography>
              )}
            </Box> */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {log.column_name === "name" && (
                <Typography className="title">{log.new_value}</Typography>
              )}
              {log.column_name === "description" && (
                <Typography className="sub-title">{log.new_value}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
