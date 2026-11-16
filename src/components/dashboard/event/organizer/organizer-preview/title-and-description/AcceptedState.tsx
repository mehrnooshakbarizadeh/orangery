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
import LatestTag from "../../../LatestTag";
import ArrowRight from "../../../ArrowRight";

export default function AcceptedState({
  event,
  // logNames,
  logNameDescription,
}: {
  event: IOrganizerEvent;
  // logNames: IEventModification[];
  logNameDescription: IEventModification[];
}) {
  const globalState = useGlobalState();
  const { data: modification } = useEventModifications(
    globalState.office_uuid,
    event.uuid!
  );

  const modificationList = modification?.map((m) => m) || [];
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
            flexGrow: 1,
            "& .left-side": { flexGrow: 1 },
            width: "100%",
          }}
        >
          <span className="left-side">
            <Typography fontSize={25} fontWeight={700} color="#2B2E33">
              {event?.name}
            </Typography>
            <Typography fontSize={16} fontWeight={400} color="#2B2E33">
              {event?.description}
            </Typography>
          </span>
        </Box>
        <HistoryLog logNameDescription={logNameDescription} />
      </Box>
    </>
  );
}

const HistoryLog = ({
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
