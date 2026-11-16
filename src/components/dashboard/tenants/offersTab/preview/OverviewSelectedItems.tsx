// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Collapse,
  Divider
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryReadOnlySwitch,
  OrangeryPrice,
  OrangeryText,
} from "../../../../OrangeryElements";

// queries & backend
import { IOfferResult } from "../../../../../queries/tenant";
import { IAsset, useAssetGroups } from "../../../../../queries/asset";
import { IDesk, useDesks } from "../../../../../queries/desk";
import { IRoom, useRooms } from "../../../../../queries/room";
import { IDoor } from "../../../../../queries/door";

// 
import AngleDownIcon from "../../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../../assets/svg/angleUp.svg";

export default function OverviewSelectedItems({
  offer,
}: {
  offer?: IOfferResult;
}) {
  const globalState = useGlobalState();
  const {
    isLoading: desksIsLoading,
    data: desks
  } = useDesks({ office_uuid: globalState.office_uuid });
  const {
    isLoading: assetsIsLoading,
    data: assets
  } = useAssetGroups(globalState.office_uuid);
  const {
    isLoading: roomsIsLoading,
    data: rooms
  } = useRooms({ office_uuid: globalState.office_uuid });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: "column",
          pr: "10px",
        }}
      >
        <Box sx={{ pt: 3, pb: "12px" }}>
          <Box
            sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }}
          />
          <Typography
            fontSize={15}
            fontWeight={700}
            sx={{ mt: -2, backgroundColor: "white", width: "13%" }}
          >{`Desks (${offer?.desks?.length} Items)`}</Typography>
        </Box>
        {offer?.desks?.map((desk) => {
          return desks
            ?.filter((d) => d.uuid === desk.uuid)
            .map((f) => <DeskItem key={f.uuid} desk={f} />);
        })}
        <Box sx={{ pt: 3, pb: "12px" }}>
          <Box
            sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }}
          />
          <Typography
            fontSize={15}
            fontWeight={700}
            sx={{ mt: -2, backgroundColor: "white", width: "13%" }}
          >{`Rooms (${offer?.rooms?.length} Items)`}</Typography>
        </Box>
        {offer?.rooms?.map((room) => {
          return rooms
            ?.filter((d) => d.uuid === room.uuid)
            .map((f) => <RoomItem key={f.uuid} room={f} />);
        })}
        <Box sx={{ pt: 3, pb: "12px" }}>
          <Box
            sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }}
          />
          <Typography
            fontSize={15}
            fontWeight={700}
            sx={{ mt: -2, backgroundColor: "white", width: "13%" }}
          >{`Assets (${offer?.assets?.length} Items)`}</Typography>
        </Box>
        {offer?.assets?.map((valueAsset) =>
          assets?.map((asset) => {
            return asset.assets
              .filter((f) => f.uuid === valueAsset.uuid)
              .map((s) => <AssetItem key={s.uuid} asset={s} />);
          })
        )}
      </Box>
    </>
  );
}

function RoomItem({ room }: { room: IRoom }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        backgroundColor: "#F9F9FA",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#F9F9FA",
          justifyContent: "space-between",
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            width: "15%",
          },
          "& .field-width": {
            mr: 2,
            width: "100%",
            textAlign: "center",
            maxWidth: "40%",
            "& .serial-number": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Box className="column-align" sx={{ width: "60%", flexBasis: "90%" }}>
          <Typography variant="h6">Room Name</Typography>
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
            <Typography variant="h4">
              <OrangeryText text={room.name || "-"} limit={45} />
            </Typography>
          </Box>
        </Box>
        <Box className="column-align" sx={{ width: "10%" }}>
          <Typography variant="h6">Desks</Typography>
          <Typography variant="h4">
            {room.desks ? room.desks.length : "0"}
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Assets</Typography>
          <Typography variant="h4">
            {room.assets ? room.assets.length : "0"}
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Doors</Typography>
          <Typography variant="h4">
            {room.doors ? room.doors.length : "0"}
          </Typography>
        </Box>
        <Box className="column-align">
          {room.doors && room.doors?.length > 0
            ? <IconButton
              onClick={handleOpen}
              size="small"
              sx={{
                height: 30,
                width: 30,
                flex: "none",
                ml: "auto",
                "& .action-icon": {
                  width: "1.3rem",
                  height: "1.3rem",
                  flex: "none",
                  cursor: "pointer",
                },
              }}
            >
              {!open ? (
                <AngleDownIcon className="action-icon" />
              ) : (
                <AngleUpIcon className="action-icon" />
              )}
            </IconButton>
            : <></>
          }
        </Box>
      </Box>
      <Collapse in={open}>
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
        <Divider />
      </Collapse>
    </Box>
  );
}

// export default function RoomCard({
//   value,
//   handleChange,
//   room,
//   selected,
// }: {
//   value: string[];
//   handleChange: (value: string[]) => void;
//   room: IRoom;
//   selected?: boolean;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => {
//     setOpen(!open);
//   };

//   const handleToggle = (room_id: string) => {
//     const newValues = [...value];
//     const index = newValues.findIndex((v) => v === room_id);
//     if (index === -1) {
//       newValues.push(room_id);
//     } else {
//       newValues.splice(index, 1);
//     }
//     handleChange(newValues);
//   };

//   return (
//     <>
//       <Observer>
//         {() => (
//           <>
//             {selected && (
//               <Paper
//                 sx={{
//                   mb: 1,
//                   mx: 0,
//                   border: "1px solid rgb(210 215 221)",
//                   boxShadow: "1px 1px 8px #0000000a",
//                   px: 2,
//                 }}
//               >
//                 <ListItem>
//                   <ListItemButton
//                     onClick={() => handleToggle(room.uuid)}
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "30px",
//                       justifyContent: "space-between",
//                       py: 2.7,
//                       px: 2.4,
//                       boxShadow: "1px 1px 8px #0000000a",
//                       border: "1px solid rgb(210 215 221)",
//                       borderRadius: 1.5,
//                       // mb: 1.2,
//                       mx: 0,
//                       rowGap: 2,
//                       fontSize: 16,
//                       fontWeight: 500,
//                       "& .column-align": {
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 1,
//                         width: "15%",
//                       },
//                     }}
//                   >
//                     <ListItemText className="column-align">
//                       <Typography variant="h6">Name</Typography>
//                       <Box
//                         sx={{
//                           mr: 2,
//                           width: "100%",
//                           textAlign: "left",
//                           maxWidth: "85%",
//                           "& .long-word": {
//                             whiteSpace: "nowrap",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                           },
//                         }}
//                       >
//                         <Typography variant="subtitle1">
//                           <OrangeryText text={room.name} limit={15} />
//                         </Typography>
//                       </Box>
//                     </ListItemText>
//                     <ListItemText className="column-align">
//                       <Typography variant="h6">Desks</Typography>
//                       <Typography variant="subtitle1">
//                         {room.desks.length}
//                       </Typography>
//                     </ListItemText>
//                     <ListItemText className="column-align">
//                       <Typography variant="h6">Assets</Typography>
//                       <Typography variant="subtitle1">
//                         {room.assets.length}
//                       </Typography>
//                     </ListItemText>

//                     <ListItemIcon
//                       sx={{
//                         "& .plus-icon": {
//                           width: "1.3rem",
//                           height: "1.3rem",
//                           color: "black",
//                         },
//                       }}
//                     >
//                       <IconButton
//                         onClick={handleOpen}
//                         sx={{
//                           "& .action-icon": {
//                             width: "1.3rem",
//                             height: "1.3rem",
//                             cursor: "pointer",
//                           },
//                         }}
//                       >
//                         {!open ? (
//                           <AngleDownIcon className="action-icon" />
//                         ) : (
//                           <AngleUpIcon className="action-icon" />
//                         )}
//                       </IconButton>
//                     </ListItemIcon>

//                     <ListItemIcon
//                       sx={{
//                         "& .plus-icon": {
//                           width: "1.3rem",
//                           height: "1.3rem",
//                           color: "black",
//                         },
//                       }}
//                     >
//                       {!selected && <PlusIcon className="plus-icon" />}
//                       {selected && <CrossIcon className="plus-icon" />}
//                     </ListItemIcon>
//                   </ListItemButton>
//                 </ListItem>
//                 <Collapse in={open}>
//                   <Box sx={{ px: 1 }}>
//                     <Divider />
//                     {room.doors?.map((door: IDoor) => (
//                       <>
//                         <DoorSubRow key={door.uuid} door={door} />
//                         <Divider />
//                       </>
//                     ))}
//                   </Box>
//                 </Collapse>
//               </Paper>
//             )}
//           </>
//         )}
//       </Observer>
//     </>
//   );
// }

function DoorSubRow({
  door
}: {
  door: IDoor
}) {
  console.log({ door });

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          gap: 1,
          rowGap: 2,
          alignItems: "center",
          py: .5,
          textAlign: "center",
          "& .subrow-header": {},
          "& .column-flex": {
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
          },
        }}
      >
        <Grid item xs={12} sm={12} md={12} className="column-flex">
          <Typography>Door name:</Typography>
          <Typography variant="h5">
            <OrangeryText text={door.name} limit={10} />
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

function DeskItem({ desk }: { desk: IDesk }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#F9F9FA",
          p: 2,
          justifyContent: "space-between",
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            // width: "15%",
          },
          "& .field-width": {
            mr: 2,
            width: "100%",
            textAlign: "center",
            maxWidth: "40%",
            "& .serial-number": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Box className="column-align" sx={{ width: "35%" }}>
          <Typography variant="h6">Name</Typography>
          <Box
            sx={{
              mr: 2,
              width: "100%",
              textAlign: "left",
              maxWidth: "100%",
              "& .long-word": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Typography variant="h4">
              <OrangeryText text={desk.name || "-"} limit={30} />
            </Typography>
          </Box>
        </Box>
        <Box className="column-align" sx={{ width: "15%" }}>
          <Typography variant="h6">Type</Typography>
          <Typography variant="h4">
            {desk.flex ? "Flex" : "Personal"}
          </Typography>
        </Box>
        <Box className="column-align" sx={{ width: "10%" }}>
          <Typography variant="h6">Capacity</Typography>
          <Typography variant="h4">
            {desk.capacity ? desk.capacity : "0"}
          </Typography>
        </Box>
        <Box className="column-align" sx={{ width: "15%" }}>
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
            <Typography variant="h4" className="long-word">
              {desk.assigned_floor?.name ? desk.assigned_floor?.name : "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function AssetItem({ asset }: { asset: IAsset }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#F9F9FA",
          p: 2,
          justifyContent: "space-between",
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            width: "15%",
          },
          "& .field-width": {
            width: "100%",
            textAlign: "left",
            maxWidth: "70%",
            "& .serial-number": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Box className="column-align">
          <Typography variant="h6">Name</Typography>
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
            <Typography variant="h4">
              {asset.name ? <OrangeryText text={asset.name} limit={30} /> : "-"}
            </Typography>
          </Box>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Serial Number</Typography>
          <Box className="field-width">
            <Typography variant="h4">
              <OrangeryText text={asset.serial_number || "-"} limit={25} />
            </Typography>
          </Box>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Price</Typography>
          <Typography variant="h4">
            {asset.price ? (
              <OrangeryPrice euro={asset.price} germanFormat />
            ) : (
              "-"
            )}
          </Typography>
        </Box>

        <OrangeryReadOnlySwitch
          label={{ checked: "Active", unchecked: "Inactive" }}
          checked={asset.active}
        />
      </Box>
    </>
  );
}
