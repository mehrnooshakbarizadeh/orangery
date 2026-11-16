// react & next
import React from "react";

// external dependencies
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// queries & backend
import { IDesk } from "../../../../../queries/desk";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { OrangeryText } from "../../../../OrangeryElements";

export default function DeskCard({
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
  const handleRemove = (desk_id: string) => {
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
              <ListItem>
                <ListItemButton
                  role={undefined}
                  // onClick={() => handleRemove(desk.uuid)}
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
                      gap: "2px",
                      width: "15%",
                    },

                    cursor: "default",
                  }}
                >
                  <ListItemText className="column-align">
                    <Typography variant="h6">Name</Typography>
                    <Box
                      sx={{
                        mr: 2,
                        width: "100%",
                        textAlign: "left",
                        maxWidth: "85%",
                        "& .long-word": {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <Typography variant="subtitle1">
                        {desk.name ? (
                          <OrangeryText text={desk.name} limit={10} />
                        ) : (
                          "-"
                        )}
                      </Typography>
                    </Box>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Type</Typography>
                    <Typography variant="subtitle1">
                      {desk.flex ? "flex" : "personal"}
                    </Typography>
                  </ListItemText>

                  <ListItemText className="column-align">
                    <Typography variant="h6">Floor</Typography>
                    <Box
                      sx={{
                        mr: 2,
                        width: "100%",
                        textAlign: "left",
                        maxWidth: "80%",
                        "& .long-word": {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <Typography variant="subtitle1">
                        {desk.assigned_floor?.name ? (
                          <OrangeryText
                            text={desk.assigned_floor?.name}
                            limit={10}
                          />
                        ) : (
                          "-"
                        )}
                      </Typography>
                    </Box>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Department</Typography>
                    <Box
                      sx={{
                        mr: 2,
                        width: "100%",
                        textAlign: "left",
                        maxWidth: "80%",
                        "& .long-word": {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <Typography variant="subtitle1">
                        {desk.department ? (
                          <OrangeryText text={desk.department} limit={8} />
                        ) : (
                          "-"
                        )}
                      </Typography>
                    </Box>
                  </ListItemText>
                  <ListItemText className="column-align">
                    <Typography variant="h6">Capacity</Typography>
                    <Typography variant="subtitle1">
                      {desk.capacity ? desk.capacity : "-"}
                    </Typography>
                  </ListItemText>

                  <IconButton
                    onClick={() => handleRemove(desk.uuid)}
                    sx={{
                      "& .icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        cursor: "pointer",
                        color: "#2B2E33",
                        mr: "auto"
                      },
                    }}
                  >
                    {selected
                      ? <CrossIcon className="icon" />
                      : <PlusIcon className="icon" />
                    }
                  </IconButton>
                  {/* <ListItemIcon
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
                  </ListItemIcon> */}
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
      </Observer>
    </>
  );
}
