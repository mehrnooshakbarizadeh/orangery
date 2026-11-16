import React from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryText, OrangeryToast } from "../../../OrangeryElements";
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { IAssetGroup } from "../../../../queries/asset";
import { AssetState, MeetingRoomState } from "../HandleRoomForm";
import { AssetSearchState } from "./AssetFieldsSelector";

export default function AssetRow({
  asset,
  state,
  selected,
}: {
  asset: IAssetGroup;
  state: MeetingRoomState;
  selected: boolean;
}) {
  const handleToggle = (asset: IAssetGroup) => {
    state?.assets.pushElementValue(
      new AssetState(asset.name, "", 0, 0, asset.stock)
    );
    if (asset) {
      OrangeryToast("Successfully added " + asset.name, "success");
    } else {
      OrangeryToast("Successfully removed from the list " + asset, "success");
    }
  };
  return (
    <>
      <Observer>
        {() => (
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
              border: selected
                ? "1px solid #56CA29"
                : "1px solid rgb(210 215 221)",
              borderRadius: 1.5,
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
                <Typography variant="h4">
                  <OrangeryText text={asset.name} limit={10} />
                </Typography>
              </Box>
            </ListItemText>
            <ListItemText className="column-align">
              <Typography variant="h6">Quantity</Typography>
              <Typography variant="h4">{asset.stock}</Typography>
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
        )}
      </Observer>
    </>
  );
}
