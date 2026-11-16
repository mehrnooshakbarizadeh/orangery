import { Box, Button, Typography } from "@mui/material";
import { IEvent, IEventModification } from "../../../../../queries/event";
import LatestTag from "../../LatestTag";
import HandleStatus from "../../organizer/organizer-preview/HandleStatus";
import ArrowRight from "../../ArrowRight";

export default function DefaultState({
  event,
  logService,
}: {
  event: IEvent;
  logService: IEventModification[];
}) {
  console.log(logService);
  return (
    <>
      <Box
        sx={{ flexGrow: 1, display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Services
        </Typography>
        <span>
          <Typography fontSize={19} fontWeight={600} color="#2B2E33">
            {event.services.map((service) => service.service_name)}
          </Typography>
        </span>
        <OrganizerRequest logService={logService} />
      </Box>
    </>
  );
}

const OrganizerRequest = ({
  logService,
}: {
  logService: IEventModification[];
}) => {
  return (
    <>
      {logService.slice(0, 5).map((log, index) => (
        <Box
          key={log.uuid}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            flexGrow: 1,
            gap: 2,
            "& .title": { fontSize: "18px", fontWeight: 600, color: "#2B2E33" },
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
              <Typography className="title">{log.suggestion}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
