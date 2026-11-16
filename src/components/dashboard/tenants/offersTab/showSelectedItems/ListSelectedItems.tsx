// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import DeskCard from "./DeskCard";
import AssetCard from "./AssetCard";
import RoomCard from "./RoomCard";

// queries & backend
import { useDesks } from "../../../../../queries/desk";
import { useAssetGroups } from "../../../../../queries/asset";

// icons, images & colors
import CrossIcon from "../../../../../assets/svg/cross.svg";
import AngleDownIcon from "../../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../../assets/svg/angleUp.svg";
import { useRooms } from "../../../../../queries/room";
import { OrangeryCircleLoading } from "../../../../OrangeryElements";

export default function ListSelectedItems({
  assetValue,
  roomValue,
  value,
  handleAssetChange,
  handleRoomChange,
  handleChange,
  handleClose,
}: {
  assetValue: string[];
  roomValue: string[];
  value: string[];
  handleAssetChange: (value: string[]) => void;
  handleRoomChange: (value: string[]) => void;
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);

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
          pl: 2,
          py: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            pr: 1,
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem", color: 'black' },
          }}
        >
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            Included Items Overview
          </Typography>

          <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
            <Observer>
              {() => (
                <Typography fontSize={15} fontWeight={700} color={"info.main"}>
                  {value.length + assetValue.length + roomValue.length} items selected
                </Typography>
              )}
            </Observer>

            <IconButton onClick={handleClose}>
              <CrossIcon className="cancel-icon" />
            </IconButton>
          </Box>

        </Box>
      </Box>

      <Box sx={{
        pl: 6,
        pr: 1,
        mr: 3,
        height: "calc(100% - 112px)",
        overflowY: "auto",
        display: "flex",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          marginLeft: "20px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          borderRadius: 5,
        },
      }}>
        <List
          sx={{
            "& .MuiListItem-root": {
              px: 0
            },
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box sx={{ pb: "12px" }}>
            <Box sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }} />
            <Typography fontSize={15} fontWeight={700} sx={{ mt: -2, backgroundColor: 'white', width: '13%' }}>{`Assets (${assetValue.length} Items)`}</Typography>
          </Box>
          {assetValue.length
            ? assetsIsLoading
              ? <OrangeryCircleLoading />
              : assets?.map((asset) => (
                <Box key={asset.name}>
                  <Observer>
                    {() => (
                      <AssetCard
                        handleChange={handleAssetChange}
                        value={assetValue}
                        asset={asset}
                      //   selected={!!value.find((v) => v === asset.name)}
                      />
                    )}
                  </Observer>
                </Box>
              ))
            : <></>
          }
          <Box sx={{ pt: 3, pb: "12px" }}>
            <Box sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }} />
            <Typography fontSize={15} fontWeight={700} sx={{ mt: -2, backgroundColor: 'white', width: '13%' }}>{`Desks (${value.length} Items)`}</Typography>
          </Box>
          {value.length
            ? desksIsLoading
              ? <OrangeryCircleLoading />
              : desks?.map((desk) => (
                <Box key={desk.uuid}>
                  <Observer>
                    {() => (
                      <DeskCard
                        handleChange={handleChange}
                        value={value}
                        desk={desk}
                        selected={!!value.find((v) => v === desk.uuid)}
                      />
                    )}
                  </Observer>
                </Box>
              ))
            : <></>
          }
          <Box sx={{ pt: 3, pb: "12px" }}>
            <Box sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }} />
            <Typography fontSize={15} fontWeight={700} sx={{ mt: -2, backgroundColor: 'white', width: '13%' }}>{`Rooms (${roomValue.length} Items)`}</Typography>
          </Box>
          {roomValue.length
            ? roomsIsLoading
              ? <OrangeryCircleLoading />
              : rooms?.map((room) => (
                <Box key={room.uuid}>
                  <Observer>
                    {() => (
                      <RoomCard
                        handleChange={handleRoomChange}
                        value={roomValue}
                        room={room}
                        selected={!!roomValue.find((v) => v === room.uuid)}
                      />
                    )}
                  </Observer>
                </Box>
              ))
            : <></>
          }
        </List>
      </Box>
    </>
  );
}