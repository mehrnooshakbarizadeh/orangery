import { Box, Icon, Typography } from "@mui/material";
import {
  IEvent,
  IEventModification,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";
import HandleStatus from "../HandleStatus";

export default function AcceptedState({
  event,
  logAddressLink,
}: {
  event: IOrganizerEvent;
  logAddressLink: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: "#f3fbf3",
          borderRadius: "14px",
          p: 1,
          pr: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          // flexGrow: 1,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            "& .left-side": { flexGrow: 1 },
          }}
        >
          <span className="left-side">
            <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
              Address
            </Typography>
            <Typography fontSize={22} fontWeight={700} color="#2B2E33">
              {event?.location ? event?.location : "-"}
            </Typography>
          </span>
        </Box>
        <HistoryLogs logAddressLink={logAddressLink} />
      </Box>
    </>
  );
}

const HistoryLogs = ({
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontSize={17} fontWeight={600} color="#2B2E33">
                {new Date(log.datetime).toLocaleString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              {index === 0 && <LatestTag />}
              <HandleStatus status={log.status} modifiedBy={log.modified_by} />
              <ArrowRight />
            </Box>
            <Typography fontSize={18} fontWeight={600}>
              {log.new_value}
            </Typography>
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
