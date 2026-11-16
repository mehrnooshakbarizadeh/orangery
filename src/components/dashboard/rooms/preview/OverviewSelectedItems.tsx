// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import DoorsIcon from "../../../../assets/svg/door.svg";
// external dependencies
import { Box, ListItemIcon, ListItemText, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryReadOnlySwitch,
  OrangeryPrice,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IRoom } from "../../../../queries/room";
import { IAsset } from "../../../../queries/asset";
import { IDesk } from "../../../../queries/desk";
import { IDoor } from "../../../../queries/door";

export default function OverviewSelectedItems({ room }: { room?: IRoom }) {
  const globalState = useGlobalState();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: "column",
          pr: "10px",
          //   height: "calc(100vh - 513px)",
          //   overflowY: "auto",
          //   "&::-webkit-scrollbar": {
          //     width: "0.4em",
          //   },
          //   "&::-webkit-scrollbar-track": {
          //     marginLeft: "20px",
          //   },
          //   "&::-webkit-scrollbar-thumb": {
          //     backgroundColor: "rgba(0,0,0,.1)",
          //     borderRadius: 5,
          //   },
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
          >
            {`Desks (${room?.desks?.length} Item${
              room?.desks.length! > 1 ? "s" : ""
            })`}
          </Typography>
        </Box>
        {room?.desks?.map((desk) => {
          return <DeskItem key={desk.uuid} desk={desk} />;
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
            sx={{ mt: -2, backgroundColor: "white", width: "15%" }}
          >
            {`Assets (${room?.assets?.length} Item${
              room?.assets?.length! > 1 ? "s" : ""
            })`}
          </Typography>
        </Box>
        {room?.assets?.map((asset) => {
          return <AssetItem key={asset.uuid} asset={asset} />;
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
          >
            {`Doors (${room?.doors?.length || 0} Item${
              room?.doors?.length! > 1 ? "s" : ""
            })`}
          </Typography>
        </Box>
        {room?.doors?.map((door) => {
          return <DoorItem key={door?.lock_id} door={door} />;
        })}
      </Box>
    </>
  );
}

function DoorItem({ door }: { door: IDoor }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#F9F9FA",
          p: 2,
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
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
            {door?.lock_name}
          </Typography>
          <Typography fontSize={12} fontWeight={400} color="#2B2E33">
            Tap here to open the door.
          </Typography>
        </ListItemText>
      </Box>
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
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
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
        <Box sx={{ width: "30%" }}>
          <Typography variant="h6">Name</Typography>
          <Typography variant="h4">
            <OrangeryText text={desk.name} limit={15} />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Type</Typography>
          <Typography variant="h4">
            {desk.flex ? "Flex" : "Personal"}
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Capacity</Typography>
          <Typography variant="h4">{desk.capacity}</Typography>
        </Box>
        <Box sx={{ width: "20%" }}>
          <Typography variant="h6">Floor</Typography>
          <Typography variant="h4">
            {desk.assigned_floor?.name ? (
              <OrangeryText
                text={desk.assigned_floor?.name || "-"}
                limit={10}
              />
            ) : (
              "-"
            )}
          </Typography>
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
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "15%",
          },
          "& .field-width": {
            width: "100%",
            textAlign: "center",
            maxWidth: "100%",
            "& .serial-number": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Box className="column-align" sx={{ width: "50%" }}>
          <Typography variant="h6">Name</Typography>
          <Box>
            <Typography variant="h4">
              <OrangeryText text={asset.name || "-"} limit={20} />
            </Typography>
          </Box>
        </Box>
        <Box className="column-align" sx={{ width: "50%" }}>
          <Typography variant="h6">Serial Number</Typography>
          <Box>
            <Typography variant="h4">
              <OrangeryText text={asset.serial_number || "-"} limit={20} />
            </Typography>
          </Box>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">Price</Typography>
          <Typography variant="h4">
            <OrangeryPrice euro={asset.price} germanFormat />
          </Typography>
        </Box>
        <Box className="column-align">
          <Typography variant="h6"></Typography>
          <Typography variant="h4"></Typography>
        </Box>
        <OrangeryReadOnlySwitch
          label={{ checked: "Active", unchecked: "Inactive" }}
          checked={asset.active}
        />
      </Box>
    </>
  );
}
