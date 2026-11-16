import { Box, Collapse, Divider, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import {
  useAvailableMeetingRooms,
  useMeetingRooms,
} from "../../../../queries/meetingRoom";
import { EventFieldsState } from "./../EventForm";
import HandleMeetingRoomSelector from "./../meetingRoomSelection/HandleMeetingRoomSelector";
import MeetingRoomList from "./../meetingRoomSelection/MeetingRoomList";

export default function MeetingRoomField({
  state,
}: {
  state: EventFieldsState;
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <form>
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexGrow: 1,
                  }}
                >
                  <Typography fontSize={24} fontWeight={700}>
                    Meeting Room
                    {state.meeting_rooms.values?.length > 1 ? "s" : ""}{" "}
                    {state.meeting_rooms.values?.length > 0
                      ? state.meeting_rooms.values?.length
                      : ""}
                  </Typography>
                  <IconButton
                    // disabled={state.meeting_rooms.values?.length === 0}
                    onClick={handleToggle}
                    sx={{
                      display: !state.meeting_rooms.values?.length
                        ? "none"
                        : "block",
                      "& .action-icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        cursor: "pointer",
                        color: "#000",
                      },
                    }}
                  >
                    {!open ? (
                      <AngleDownIcon className="action-icon" />
                    ) : (
                      <AngleUpIcon className="action-icon" />
                    )}
                  </IconButton>
                </Box>
              </>
            )}
          </Observer>
          <Observer>
            {() => <HandleMeetingRoomSelector state={state} />}
          </Observer>
        </Box>
        <Observer>
          {() => <MeetingRoomList open={open} state={state} />}
        </Observer>
      </form>
    </>
  );
}
