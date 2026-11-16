// react & next
import React from "react";

// external dependencies
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// queries & backend
import { IDesk } from "../../../../queries/desk";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import DoorsIcon from "../../../../assets/svg/door.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { IDoor } from "../../../../queries/door";

export default function DoorCard({
  value,
  handleChange,
  door,
  selected,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  door: IDoor;
  selected: boolean;
}) {
  const handleToggle = (door_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === door_id);
    if (index === -1) {
      newValues.push(door_id);
    } else {
      newValues.splice(index, 1);
    }
    handleChange(newValues);
  };

  return (
    <>
      <Observer>
        {() => (
          <>
            {selected && (
              <ListItem>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(door.lock_id)}
                  dense
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // gap: "30px",
                    justifyContent: "space-between",
                    py: 2.7,
                    pr: 2.4,
                    pl: "27px",
                    boxShadow: "1px 1px 8px #0000000a",
                    border: "1px solid rgb(210 215 221)",
                    borderRadius: 1.5,
                    // mb: 1.2,
                    mx: 0,
                    rowGap: 2,
                    fontSize: 16,
                    fontWeight: 500,
                    "& .column-align": {
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
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
                      variant="body1"
                      sx={{
                        wordBreak: "break-all",
                      }}
                    >
                      {door.lock_name ? door.lock_name : "-"}
                    </Typography>
                    <Typography fontSize={12} fontWeight={400} color="#2B2E33">
                      Tap here to open the door.
                    </Typography>
                  </ListItemText>

                  <ListItemIcon
                    sx={{
                      "& .plus-icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        color: "black",
                      },
                    }}
                  >
                    {!selected && <PlusIcon className="plus-icon" />}
                    {selected && <CrossIcon className="plus-icon" />}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
      </Observer>
    </>
  );
}
