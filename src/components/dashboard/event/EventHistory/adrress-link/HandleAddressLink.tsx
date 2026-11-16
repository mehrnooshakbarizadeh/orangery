import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IEvent, IEventModification } from "../../../../../queries/event";
import EditButton from "./EditButton";
import DefaultState from "./DefaultState";
import { EventLogState } from "../HandleLogsRendering";

export default function HandleAddressLink({
  logAddressLink,
  state,
  event,
}: {
  state: EventLogState;
  logAddressLink: IEventModification[];
  event: IEvent;
}) {
  const locationValues = logAddressLink.filter(
    (sg) => sg.column_name === "location"
  );

  const locationValue =
    locationValues[0]?.status === "requested"
      ? locationValues[0].new_value
      : "";

  const linkValues = logAddressLink.filter(
    (sg) => sg.column_name === "event_link"
  );
  const linkValue =
    linkValues[0]?.status === "requested" ? linkValues[0].new_value : "";

  console.log(linkValue);
  return (
    <>
      <Observer>
        {() => (
          <Box
            sx={{
              backgroundColor: "#F9F9FA",
              border: "white",
              borderRadius: "10px",
              p: 3,
              display: "flex",
              justifyContent: "end",
              gap: 2.5,
            }}
          >
            <>
              <DefaultState event={event} logAddressLink={logAddressLink} />
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <EditButton
                  event={event}
                  logAddressLink={logAddressLink}
                  state={state}
                  locationValue={locationValue}
                  linkValue={linkValue}
                  disabled={!locationValue && !linkValue}
                />
              </Box>
            </>
          </Box>
        )}
      </Observer>
    </>
  );
}
