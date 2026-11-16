import { Box, Collapse, Divider, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import AngleDownIcon from "../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../assets/svg/angleUp.svg";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { useMeetingRooms } from "../../../queries/meetingRoom";
import AssetField from "./assetSelection/AssetField";
import { EventFieldsState } from "./EventForm";
import HandleMeetingRoomSelector from "./meetingRoomSelection/HandleMeetingRoomSelector";
import MeetingRoomField from "./meetingRoomSelection/MeetingRoomField";
import MeetingRoomList from "./meetingRoomSelection/MeetingRoomList";
import ServiceField from "./serviceSelection/ServiceField";

export default function Form2({ state }: { state: EventFieldsState }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Observer>
      {() => (
        <>
          <MeetingRoomField state={state} />
          <Divider sx={{ pt: 4, color: "#C9CCD2" }} />

          <AssetField state={state} />
          <Divider sx={{ pt: 4, color: "#C9CCD2" }} />

          <ServiceField state={state} />
          <Divider sx={{ pt: 4, color: "#C9CCD2" }} />
        </>
      )}
    </Observer>
  );
}
