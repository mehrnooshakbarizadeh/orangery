import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "../../../../assets/svg/arrow-left.svg";
import {
  IEvent,
  IEventModification,
  useEventModifications,
  useEvents,
} from "../../../../queries/event";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useRouter } from "next/router";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
} from "../../../OrangeryElements";
import { Observer } from "mobx-react-lite";
import HandleNameDescription from "./name-description/HandleNameDescription";
import HandleAddressLink from "./adrress-link/HandleAddressLink";
import HandleDateTime from "./dateTime/HandleDateTime";
import HandleOrganizers from "./organizers/HandleOrganizers";
import PlaceholderSvg from "../../../../assets/svg/placeholders/event-empty-space.svg";
import HandlePresenter from "./presenter/HandlePresenter";
import HandleAttendee from "./attendee/HandleAttendee";
import HandleMeetingRoom from "./meeting-room/HandleMeetingRoom";
import HandleAsset from "./asset/HandleAsset";
import HandleService from "./service/HandleService";
import HandleLogsRendering from "./HandleLogsRendering";

interface IProps {
  eventModification: IEventModification;
}

export default function EventHistoryPage() {
  const globalState = useGlobalState();
  const { data: events } = useEvents(globalState.office_uuid);
  const eventList = events?.map((event) => event) || [];
  const router = useRouter();
  const { id } = router.query;
  const eventObject = eventList?.find((event) => {
    if (!event) return;
    if (event.uuid === id) {
      return event;
    }
  })!;
  const event_uuid = eventObject?.uuid ?? "";
  const { data: eventsModification, isLoading } = useEventModifications(
    globalState.office_uuid,
    event_uuid
  );
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : eventList && eventList.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "#fff",
            p: 3,
            overflow: "auto",
            height: "100%",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
            "& .title": { fontSize: 31, fontWeight: 700, color: "#2B2E33" },
            "& .sub-title": { fontSize: 16, fontWeight: 400, color: "#2B2E33" },
          }}
        >
          <Button
            onClick={handleBack}
            sx={{ justifyContent: "start", width: "12%" }}
          >
            <Typography
              sx={{
                color: "#55585C",
                fontsize: "16px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              <IconButton
                sx={{
                  mr: 1,
                  "& .arrow-icon": { width: "1.1rem", height: "1.1rem" },
                }}
              >
                <ArrowBackIcon className="arrow-icon" />
              </IconButton>
              Back to Events
            </Typography>
          </Button>
          <Observer>
            {() => (
              <>
                <HandleLogsRendering eventObject={eventObject} />
              </>
            )}
          </Observer>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No event has been created yet"}
          subtitle={"Create an event by clicking on the button below."}
          PlaceholderSvg={PlaceholderSvg}
          width="5rem"
          height="5.6rem"
          addNewButtonText={""}
          vertical
        />
      )}
    </>
  );
}
