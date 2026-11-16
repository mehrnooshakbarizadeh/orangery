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
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  OrangeryReadOnlySwitch,
  OrangeryPrice,
} from "../../../OrangeryElements";

// queries & backend
import { IAsset, IAssetGroup } from "../../../../queries/asset";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function AssetItem({
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
  const handleToggle = (asset_id: string) => {
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
        <ListItem sx={{ px: 0 }}>
          <ListItemButton
            role={undefined}
            onClick={() => handleToggle(subRows.uuid)}
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
                gap: 1,
                width: "10%",
              },
            }}
          >
            <ListItemText className="column-align">
              <Typography variant="h6">Serial Number</Typography>
              {subRows.serial_number ? (
                <Box
                  sx={{
                    mr: 2,
                    width: "100%",
                    textAlign: "start",
                    maxWidth: "44%",
                    "& .serial-number": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Typography variant="h4" className="serial-number">
                    {subRows.serial_number}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h4">-</Typography>
              )}
            </ListItemText>
            <ListItemText className="column-align">
              <Typography variant="h6">Price</Typography>
              <Typography variant="h4">
                <OrangeryPrice euro={subRows.price} germanFormat />
              </Typography>
            </ListItemText>
            <ListItemText className="column-align">
              <OrangeryReadOnlySwitch
                label={{ checked: "Active", unchecked: "Inactive" }}
                checked={subRows.active}
              />
            </ListItemText>

            <ListItemIcon
              sx={{
                "& .plus-icon": { width: "1.3rem", height: "1.3rem" },
              }}
            >
              {!selected && <PlusIcon className="plus-icon" />}
              {selected && <CrossIcon className="plus-icon" />}
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}
