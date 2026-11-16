import { Box, Icon, Typography } from "@mui/material";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
  useEventModifications,
} from "../../../../../../queries/event";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";
import HandleStatus from "../HandleStatus";

export default function AcceptedState({
  event,
  logService,
}: {
  event: IOrganizerEvent;
  logService: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: "#f3fbf3",
          borderRadius: "14px",
          flexGrow: 1,
          p: 1,
          pr: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            flexDirection: "column",
            flexGrow: 1,
            "& .left-side": { flexGrow: 1 },
            width: "100%",
          }}
        >
          <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
            Services
          </Typography>
          <span className="left-side">
            <Typography fontSize={19} fontWeight={600} color="#55585C">
              {event?.services?.map((service) => service.service_name)}
            </Typography>
          </span>
        </Box>
        <HistoryLog logService={logService} />
      </Box>
    </>
  );
}

const HistoryLog = ({ logService }: { logService: IEventModification[] }) => {
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography className="sub-title">{log.suggestion}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

const LatestTag = () => {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "6px",
          py: "1px",
        }}
      >
        Latest
      </Typography>
    </>
  );
};

const ArrowRight = () => {
  return (
    <Box
      sx={{
        height: "21px",
        "& .arrow-icon": { width: "1rem", height: "1rem" },
      }}
    >
      <ArrowRightIcon className="arrow-icon" />
    </Box>
  );
};
