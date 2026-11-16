import { Box, IconButton } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { FloorState, QuickStartState } from "./HandleFloorView";
import { QuickItem } from "./QuickItem";
import { QuickItemStr } from "./QuickItemStr";
import RoomIcon from "../../../../assets/svg/room.svg";
import DeskIcon from "../../../../assets/svg/desk.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import MeetingRoomIcon from "../../../../assets/svg/meetingRoom.svg";

export function Floors({
  state,
  floor,
}: {
  state: QuickStartState;
  floor: FloorState;
}) {
  const handleDrop = () => {
    const index = state.floors.values.findIndex((v) => v.value === floor);
    state.floors.deleteElementValue(index);
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => handleDrop()}
          sx={{
            position: "absolute",
            right: "-14px",
            top: "-18px",
            "& .cross-icon": {
              width: "1.5rem",
              height: "1.5rem",
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50%",
              p: 0.5,
            },
          }}
        >
          <CrossIcon className="cross-icon" />
        </IconButton>

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "6.5px",
            flexDirection: "column",
          }}
        >
          <Box>
            <Observer>
              {() => (
                <QuickItemStr
                  name="floor"
                  value={floor.name.value}
                  onChange={(newValue) => {
                    floor.name.value = newValue;
                  }}
                />
              )}
            </Observer>
          </Box>
          <Box sx={{ display: "flex", alingItems: "center", gap: 1, p: 1 }}>
            <Observer>
              {() => (
                <QuickItem
                  sx={{ backgroundColor: "#F9F9FA" }}
                  icon={<RoomIcon />}
                  name="Rooms"
                  value={floor.rooms.value}
                  onChange={(newValue) => {
                    floor.rooms.value = newValue;
                  }}
                />
              )}
            </Observer>
            <Observer>
              {() => (
                <QuickItem
                  sx={{ backgroundColor: "#F9F9FA" }}
                  icon={<DeskIcon />}
                  name="Desks"
                  value={floor.desks.value}
                  onChange={(newValue) => {
                    floor.desks.value = newValue;
                  }}
                />
              )}
            </Observer>
            <Observer>
              {() => (
                <QuickItem
                  sx={{ backgroundColor: "#F9F9FA" }}
                  icon={<MeetingRoomIcon />}
                  name="Meeting Rooms"
                  value={floor.meeting_rooms.value}
                  onChange={(newValue) => {
                    floor.meeting_rooms.value = newValue;
                  }}
                />
              )}
            </Observer>
          </Box>
        </Box>
      </Box>
    </>
  );
}
