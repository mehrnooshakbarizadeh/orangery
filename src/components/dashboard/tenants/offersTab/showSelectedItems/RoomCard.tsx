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
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// 
import { OrangeryText } from "../../../../OrangeryElements";

// queries & backend
import { IRoom } from "../../../../../queries/room";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import AngleDownIcon from "../../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../../assets/svg/angleUp.svg";
import { IDoor } from "../../../../../queries/door";

export default function RoomCard({
  value,
  handleChange,
  room,
  selected,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  room: IRoom;
  selected?: boolean;
}) {
  const handleRemove = (room_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === room_id);
    if (index === -1) {
      newValues.push(room_id);
    } else {
      newValues.splice(index, 1);
    }
    handleChange(newValues);
  };

  const [open, setOpen] = React.useState(false);
  const handleToggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Observer>
        {() => (
          <>
            {selected && (
              <>
                <ListItem>
                  <ListItemButton
                    // onClick={() => handleRemove(room.uuid)}
                    sx={{
                      cursor: "default",
                      display: "flex",
                      flexDirection: "column",
                      mx: 0,
                      // rowGap: 2,
                      boxShadow: "1px 1px 8px #0000000a",
                      border: "1px solid rgb(210 215 221)",
                      borderRadius: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "default",
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        gap: "30px",
                        justifyContent: "space-between",
                        // mb: 1.2,
                        mx: 0,
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
                            <OrangeryText text={room.name} limit={15} />
                          </Typography>
                        </Box>
                      </ListItemText>
                      <ListItemText className="column-align">
                        <Typography variant="h6">Desks</Typography>
                        <Typography variant="subtitle1">
                          {room.desks.length}
                        </Typography>
                      </ListItemText>
                      <ListItemText className="column-align">
                        <Typography variant="h6">Assets</Typography>
                        <Typography variant="subtitle1">
                          {room.assets.length}
                        </Typography>
                      </ListItemText>
                      <ListItemText className="column-align">
                        <Typography variant="h6">Doors</Typography>
                        <Typography variant="subtitle1">
                          {room.doors?.length ?? 0}
                        </Typography>
                      </ListItemText>

                      <Box
                        sx={{
                          height: 40,
                          width: 40,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        {room.doors?.length
                          ? <IconButton
                            onClick={handleToggleOpen}
                            disabled={!room.doors?.length}
                            sx={{
                              "& .icon": {
                                width: "1.3rem",
                                height: "1.3rem",
                                cursor: "pointer",
                                color: "#2B2E33",
                              },
                            }}
                          >
                            {!open ? (
                              <AngleDownIcon className="icon" />
                            ) : (
                              <AngleUpIcon className="icon" />
                            )}
                          </IconButton>
                          : <></>
                        }
                      </Box>

                      <IconButton
                        onClick={() => handleRemove(room.uuid)}
                        sx={{
                          "& .icon": {
                            width: "1.3rem",
                            height: "1.3rem",
                            cursor: "pointer",
                            color: "#2B2E33",
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
                      </ListItemIcon> */}
                    </Box>

                    <Collapse
                      in={open}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Divider
                        sx={{
                          border: "1px solid #EDEEF0"
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: .75,
                          my: 1
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#9A9CA0",
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          Doors
                        </Typography>
                        {room.doors?.map((door: IDoor) => (
                          <>
                            <Typography
                              sx={{
                                color: "#2B2E33",
                                fontSize: 14,
                                fontWeight: 600
                              }}
                            >
                              {door.name}
                            </Typography>
                          </>
                        ))}
                      </Box>
                    </Collapse>
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </>
        )}
      </Observer>
    </>
  );
}
