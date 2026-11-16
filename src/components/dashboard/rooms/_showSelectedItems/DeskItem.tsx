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
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function DeskItem({
  value,
  handleChange,
  desk,
  selected,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  desk: IDesk;
  selected: boolean;
}) {
  const handleToggle = (desk_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === desk_id);
    if (index === -1) {
      newValues.push(desk_id);
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
              <ListItem sx={{ px: 0 }}>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(desk.uuid)}
                  dense
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    justifyContent: "space-between",
                    py: 2.7,
                    px: 2.4,
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
                      gap: 1,
                      width: "15%",
                    },
                  }}
                >
                  <ListItemText className="column-align">
                    <Typography variant="h6">Name</Typography>
                    <Typography variant="h4">{desk.name}</Typography>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Type</Typography>
                    <Typography variant="h4">
                      {desk.flex ? "flex" : "personal"}
                    </Typography>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Capacity</Typography>
                    <Typography variant="h4">{desk.capacity}</Typography>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Floor</Typography>
                    <Typography variant="h4">
                      {desk.assigned_floor?.name}
                    </Typography>
                  </ListItemText>

                  <ListItemIcon
                    sx={{
                      "& .plus-icon": { width: "1.3rem", height: "1.3rem" },
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
