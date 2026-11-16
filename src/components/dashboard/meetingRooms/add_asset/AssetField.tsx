import { Box, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";
import { IMeetingRoom } from "../../../../queries/meetingRoom";
import { AssetState, MeetingRoomState } from "../HandleRoomForm";
import AssetList from "./AssetList";
import HandleAssetSelector from "./HandleAssetSelector";

export default function AssetField({
  state,
  asset,
  meetingRoom,
}: {
  state: MeetingRoomState;
  asset?: AssetState;
  meetingRoom?: IMeetingRoom;
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          pt: 4,
        }}
      >
        <Observer>
          {() => (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexGrow: 1,
                }}
              >
                <Typography fontSize={24} fontWeight={700}>
                  Asset
                  {state.assets.values?.length > 1 ? "s" : ""}{" "}
                  {state.assets.values?.length}
                </Typography>
                <IconButton
                  onClick={handleToggle}
                  sx={{
                    "& .action-icon": {
                      width: "1.3rem",
                      height: "1.3rem",
                      cursor: "pointer",
                      color: "#000",
                    },
                  }}
                >
                  {!open ? (
                    <AngleDownIcon className="action-icon" />
                  ) : (
                    <AngleUpIcon className="action-icon" />
                  )}
                </IconButton>
              </Box>
            </>
          )}
        </Observer>
        <Observer>
          {() => <HandleAssetSelector state={state} asset={asset} />}
        </Observer>
      </Box>
      <Observer>
        {() => (
          <AssetList open={open} state={state} meetingRoom={meetingRoom} />
        )}
      </Observer>
    </>
  );
}
