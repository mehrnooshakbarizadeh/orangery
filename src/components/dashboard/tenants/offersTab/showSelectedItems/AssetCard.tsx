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

// orangery elements & internal dependencies
import {
  OrangeryReadOnlySwitch,
  OrangeryPrice,
  OrangeryText,
} from "../../../../OrangeryElements";

// queries & backend
import { IAsset, IAssetGroup } from "../../../../../queries/asset";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../../assets/svg/cross.svg";

export default function AssetCard({
  value,
  handleChange,
  asset,
}: // selected,
  {
    value: string[];
    handleChange: (value: string[]) => void;
    asset: IAssetGroup;
    // selected: boolean;
  }) {
  return (
    <>
      <Observer>
        {() => (
          <>
            {asset.assets.map((subRows) => (
              <ShowAssetSelectedSubRows
                key={subRows.uuid}
                handleChange={handleChange}
                value={value}
                subRows={subRows}
                selected={!!value.find((v) => v === subRows.uuid)}
              />
            ))}
          </>
        )}
      </Observer>
    </>
  );
}

function ShowAssetSelectedSubRows({
  value,
  handleChange,
  selected,
  subRows,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  subRows: IAsset;
  selected: boolean;
}) {
  const handleRemove = (asset_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === asset_id);
    if (index === -1) {
      newValues.push(asset_id);
    } else {
      newValues.splice(index, 1);
    }
    handleChange(newValues);
  };

  return (
    <>
      {selected && (
        <ListItem>
          <ListItemButton
            role={undefined}
            // onClick={() => handleRemove(subRows.uuid)}
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
                width: "10%",
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
                  maxWidth: "80%",
                  "& .long-word": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography variant="subtitle1">
                  {subRows.name ? (
                    <OrangeryText text={subRows.name} limit={10} />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Box>
            </ListItemText>

            <ListItemText className="column-align">
              <Typography variant="h6">Serial Number</Typography>
              {subRows.serial_number ? (
                <Box
                  sx={{
                    mr: 2,
                    width: "100%",
                    textAlign: "start",
                    maxWidth: "70%",
                    "& .serial-number": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Typography variant="subtitle1">
                    <OrangeryText text={subRows.serial_number} limit={12} />
                  </Typography>
                </Box>
              ) : (
                <Typography variant="subtitle1">-</Typography>
              )}
            </ListItemText>

            <ListItemText className="column-align">
              <Typography variant="h6">Price</Typography>
              <Typography variant="subtitle1">
                <OrangeryPrice euro={subRows.price} germanFormat />
              </Typography>
            </ListItemText>

            <ListItemText className="column-align">
              <OrangeryReadOnlySwitch
                label={{ checked: "Active", unchecked: "Inactive" }}
                checked={subRows.active}
              />
            </ListItemText>

            <IconButton
              onClick={() => handleRemove(subRows.uuid)}
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
  );
}
