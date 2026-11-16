import { Box, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import LatestTag from "../../LatestTag";
import HandleStatus from "../../organizer/organizer-preview/HandleStatus";
import ArrowRight from "../../ArrowRight";

export default function DefaultState({
  event,
  logAddressLink,
}: {
  event: IEvent;
  logAddressLink: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{ flexGrow: 1, display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Address
        </Typography>
        <span>
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {event?.location ? event?.location : "-"}
          </Typography>
          {/* <Typography fontSize={16} fontWeight={400} color="#2B2E33">
            {event?.event_link ? event?.event_link : "-"}
          </Typography> */}
        </span>
        <OrganizerRequest logAddressLink={logAddressLink} />
      </Box>
    </>
  );
}

const OrganizerRequest = ({
  logAddressLink,
}: {
  logAddressLink: IEventModification[];
}) => {
  return (
    <>
      {logAddressLink.slice(0, 5).map((log, index) => (
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {log.column_name === "location" ? (
                <Typography className="title">{log.new_value}</Typography>
              ) : (
                <Typography className="sub-title">{log.new_value}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
