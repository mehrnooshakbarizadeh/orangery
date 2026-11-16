import { Box, Collapse, Divider, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useAssets } from "../../../../queries/asset";
import { useMeetingRooms } from "../../../../queries/meetingRoom";
import { EventFieldsState } from "../EventForm";
import HandleMeetingRoomSelector from "../meetingRoomSelection/HandleMeetingRoomSelector";
import MeetingRoomList from "../meetingRoomSelection/MeetingRoomList";
import AssetList from "./AssetList";
import HandleAssetSelector from "./HandleAssetSelector";

export default function AssetField({ state }: { state: EventFieldsState }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <form>
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
                    {state.assets.values?.length > 0
                      ? state.assets.values?.length
                      : ""}
                  </Typography>
                  <IconButton
                    onClick={handleToggle}
                    sx={{
                      display: !state.assets.values?.length ? "none" : "block",
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
          <Observer>{() => <HandleAssetSelector state={state} />}</Observer>
        </Box>
        <Observer>{() => <AssetList open={open} state={state} />}</Observer>
      </form>
    </>
  );
}
