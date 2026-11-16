import { Box, Typography } from "@mui/material";
import {
  IAttendee,
  IEvent,
  IEventModification,
  IOrganizer,
  IPresenter,
} from "../../../../../queries/event";
import LatestTag from "../../LatestTag";
import HandleStatus from "../../organizer/organizer-preview/HandleStatus";
import ArrowRight from "../../ArrowRight";
import OrganizerInfo from "../OrganizersInfo";
import React from "react";
import RequestedValues from "../RequestedValues";
import ModifiedValues from "../ModifiedValues";
import AcceptedValues from "../AcceptedValues";
import DeclinedValues from "../DeclinedValues";

export default function DefaultState({
  event,
  logPresenter,
}: {
  event: IEvent;
  logPresenter: IEventModification[];
}) {
  return (
    <>
      <Box
        sx={{ flexGrow: 1, display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Typography
          fontSize={20}
          fontWeight={600}
          color="#A5AAB4"
        >{`Presenters - ${event?.presenters.length} Person${
          event?.presenters.length > 1 ? "s" : ""
        }`}</Typography>
        <span>
          <Typography fontSize={25} fontWeight={700} color="#2B2E33">
            {event?.presenters.map((presenter) => (
              <OrganizerInfo key={presenter.uuid} person={presenter} />
            ))}
          </Typography>
        </span>
        <OrganizerRequest logPresenter={logPresenter} />
      </Box>
    </>
  );
}

const OrganizerRequest = ({
  logPresenter,
}: {
  logPresenter: IEventModification[];
}) => {
  return (
    <>
      {logPresenter.slice(0, 5).map((log, index) => (
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
