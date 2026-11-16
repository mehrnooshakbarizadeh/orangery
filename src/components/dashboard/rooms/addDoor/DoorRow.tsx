// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

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
import { OrangeryToast } from "../../../OrangeryElements";

// queries & backend
import { IDesk, useDesks } from "../../../../queries/desk";
import DoorsIcon from "../../../../assets/svg/door.svg";
// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { IDoor } from "../../../../queries/door";

export default function DoorRow({
  door,
  selected,
  value,
  handleChange,
}: {
  door: IDoor;
  selected: boolean;
  value: string[];
  handleChange: (value: string[]) => void;
}) {
  const handleToggle = (door_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === door_id);
    if (index === -1) {
      newValues.push(door_id);
      if (door_id) {
        OrangeryToast("Successfully added " + door.lock_name, "success");
      }
    } else {
      newValues.splice(index, 1);
      OrangeryToast(
        "Successfully removed from the list " + door.lock_name,
        "success"
      );
    }
    handleChange(newValues);
  };
  return (
    <>
      <ListItemButton
        // role={undefined}
        onClick={() => handleToggle(door.lock_id)}
        dense
        sx={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          // gap: "70px",
          // justifyContent: "space-between",
          py: "12px",
          pr: 2.4,
          pl: "27px",
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
        <ListItemIcon
          sx={{
            "&.door-icon": { width: "1.6rem", height: "1.6rem" },
            "&.MuiListItemIcon-root": { minWidth: "45px" },
          }}
        >
          <DoorsIcon className="door-icon" />
        </ListItemIcon>

        <ListItemText className="column-align">
          <Typography
            fontSize={16}
            fontWeight={400}
            color="#2B2E33"
            className="serial-number"
          >
            {door.lock_name}
          </Typography>
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
