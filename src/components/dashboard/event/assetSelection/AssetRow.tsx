import React from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import {
  OrangeryPrice,
  OrangeryText,
  OrangeryToast,
} from "../../../OrangeryElements";
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { IMeetingRoom } from "../../../../queries/meetingRoom";
import { IEventMeetingRoom } from "../../../../queries/event";
import { AssetState, EventFieldsState, MeetingRoomState } from "../EventForm";
import { IAsset, IAssetGroup } from "../../../../queries/asset";

export default function AssetRow({
  asset,
  state,
  selected,
}: {
  asset: IAssetGroup;
  state: EventFieldsState;
  selected: boolean;
}) {
  console.log(selected);
  const handleToggle = (asset: IAssetGroup) => {
    state?.assets.pushElementValue(new AssetState(asset.name, "", 0, 0));
    if (asset) {
      OrangeryToast("Successfully added " + asset.name, "success");
    } else {
      OrangeryToast("Successfully removed from the list " + asset, "success");
    }
  };
  return (
    <>
      <ListItemButton
        onClick={() => handleToggle(asset)}
        dense
        sx={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          gap: "70px",
          justifyContent: "space-between",
          py: 2.7,
          px: 2.4,
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
          "& .title": { fontSize: 12, fontWeight: 600, color: "#9A9CA0" },
          "& .sub-title": { fontSize: 16, fontWeight: 700, color: "#2B2E33" },
        }}
      >
        <ListItemText className="column-align">
          <Typography className="title">Name</Typography>
          <Box
            sx={{
              mr: 2,
              width: "100%",
              textAlign: "left",
              maxWidth: "100%",
              "& .serial-number": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Typography className="sub-title">
              <OrangeryText text={asset.name} limit={10} />
            </Typography>
          </Box>
        </ListItemText>

        <ListItemText className="column-align">
          <Typography className="title">Stock</Typography>
          <Typography className="sub-title">
            {asset.stock ? asset.stock : 0}
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
