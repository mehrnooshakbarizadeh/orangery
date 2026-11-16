// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OrangeryText, OrangeryToast } from "../../../../OrangeryElements";

// queries & backend
import { IDesk, useDesks } from "../../../../../queries/desk";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { IRoom } from "../../../../../queries/room";

export default function RoomRow({
  room,
  selected,
  value,
  handleChange,
}: {
  room: IRoom;
  selected: boolean;
  value: string[];
  handleChange: (value: string[]) => void;
}) {
  const handleToggle = (room_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === room_id);
    if (index === -1) {
      newValues.push(room_id);
      if (room_id) {
        OrangeryToast("Successfully added " + room.name, "success");
      }
    } else {
      newValues.splice(index, 1);
      OrangeryToast(
        "Successfully removed from the list " + room.name,
        "success"
      );
    }
    handleChange(newValues);
  };

  return (
    <>
      <ListItemButton
        // role={undefined}
        onClick={() => handleToggle(room.uuid)}
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
          border: selected ? "1px solid #56CA29" : "1px solid rgb(210 215 221)",
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
          <Typography variant="h6">ROOM NAME</Typography>
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
              <OrangeryText text={room.name} limit={20} />
            </Typography>
          </Box>
        </ListItemText>
        <ListItemText className="column-align">
          <Typography variant="h6">DESKS</Typography>
          <Typography variant="h4">{room.desks.length}</Typography>
        </ListItemText>
        <ListItemText className="column-align">
          <Typography variant="h6">ASSETS</Typography>
          <Typography variant="h4">{room.assets.length}</Typography>
        </ListItemText>
        <ListItemText className="column-align">
          <Typography variant="h6">DOORS</Typography>
          <Typography variant="h4">{room.doors?.length ?? 0}</Typography>
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
    </>
  );
}
