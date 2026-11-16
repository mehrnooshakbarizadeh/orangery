import React from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryText, OrangeryToast } from "../../../OrangeryElements";
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { EventFieldsState, MeetingRoomState } from "../EventForm";
import { IMeetingRoom } from "../../../../queries/meetingRoom";

export default function MeetingRoomRow({
  meetingRoom,
  state,
  selected,
}: {
  meetingRoom: IMeetingRoom;
  state: EventFieldsState;
  selected: boolean;
}) {
  const handleToggle = (meetingRoom: IMeetingRoom) => {
    if (
      state.meeting_rooms?.values?.find(
        (m) => m.value.data.uuid === meetingRoom.uuid
      )
    ) {
      return;
    }
    state.meeting_rooms?.pushElementValue(
      new MeetingRoomState(
        meetingRoom.uuid,
        meetingRoom.name,
        meetingRoom.assets.map((a) => a.grouped_name),
        // 0,
        0
      )
    );
    if (meetingRoom) {
      OrangeryToast("Successfully added " + meetingRoom.name, "success");
    } else {
      OrangeryToast(
        "Successfully removed from the list " + meetingRoom,
        "success"
      );
    }
  };
  return (
    <>
      <Observer>
        {() => (
          <ListItemButton
            onClick={() => handleToggle(meetingRoom)}
            dense
            sx={{
              flex: "none",
              display: "flex",
              alignItems: "center",
              gap: "70px",
              justifyContent: "space-between",
              py: 2.7,
              px: 2.4,
              boxShadow: "1px 1px 8px #0000000a",
              border: selected
                ? "1px solid #56CA29"
                : "1px solid rgb(210 215 221)",
              borderRadius: 1.5,
              // mb: 1.2,
              mx: 0,
              rowGap: 2,
              fontSize: 16,
              fontWeight: 500,
              "& .column-align": {
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "15%",
              },
            }}
          >
            <ListItemText className="column-align">
              <Typography variant="h6">Room Name</Typography>
              <Box
                sx={{
                  mr: 2,
                  width: "100%",
                  textAlign: "left",
                  maxWidth: "100%",
                  "& .serial-number": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography variant="h4">
                  <OrangeryText text={meetingRoom.name} limit={10} />
                </Typography>
              </Box>
            </ListItemText>
            <ListItemText className="column-align">
              <Typography variant="h6">Assets</Typography>
              <Typography variant="h4">{meetingRoom.assets?.length}</Typography>
            </ListItemText>

            <Observer>
              {() => (
                <ListItemIcon
                  sx={{ "& .plus-icon": { width: "1.3rem", height: "1.3rem" } }}
                >
                  {selected && <CrossIcon className="plus-icon" />}
                  {!selected && <PlusIcon className="plus-icon" />}
                </ListItemIcon>
              )}
            </Observer>
          </ListItemButton>
        )}
      </Observer>
    </>
  );
}
