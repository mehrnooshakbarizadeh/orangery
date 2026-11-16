import { Box, Icon, Typography } from "@mui/material";
import {
  IAttendee,
  IEvent,
  IEventModification,
  IOrganizer,
  IOrganizerEvent,
  IPerson,
  IPresenter,
} from "../../../../../../queries/event";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";
import HandleStatus from "../HandleStatus";
import React from "react";
import LatestTag from "../../../LatestTag";
import ArrowRight from "../../../ArrowRight";
import RequestedValues from "../../../EventHistory/RequestedValues";
import ModifiedValues from "../../../EventHistory/ModifiedValues";
import AcceptedValues from "../../../EventHistory/AcceptedValues";
import DeclinedValues from "../../../EventHistory/DeclinedValues";

export default function AcceptedState({
  event,
  logOrganizers,
}: {
  event: IOrganizerEvent;
  logOrganizers: IEventModification[];
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
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            flexDirection: "column",
            width: "100%",
            "& .left-side": {
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 1,
            },
          }}
        >
          <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
            Organizers -{" "}
            {`${event.organizers?.length} Person${
              event.organizers?.length! > 1 ? "s" : ""
            }`}
          </Typography>
          <span className="left-side">
            <Typography fontSize={22} fontWeight={700} color="#2B2E33">
              {event.organizers?.map((organizer) => (
                <OrganizerRow key={organizer.uuid} organizer={organizer} />
              ))}
            </Typography>
          </span>
        </Box>
        <HistoryLogs logOrganizers={logOrganizers} />
      </Box>
    </>
  );
}

const OrganizerRow = ({ organizer }: { organizer: IOrganizer }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {organizer.name}
        </Typography>
        <Typography fontSize={19} fontWeight={600} color="#A5AAB4">
          {organizer.email}
        </Typography>
      </Box>
    </>
  );
};
const HistoryLogs = ({
  logOrganizers,
}: {
  logOrganizers: IEventModification[];
}) => {
  return (
    <>
      {logOrganizers.slice(0, 5).map((log, index) => (
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {log.status === "requested" && (
                <RequestedValues requests={log.new_values} />
              )}
              {log.status === "modified" && (
                <ModifiedValues modifiedReqs={log.modified_values} />
              )}
              {log.status === "accepted" && (
                <AcceptedValues accValues={log.new_values} />
              )}
              {log.status === "declined" && (
                <DeclinedValues decValues={log.new_values} />
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
