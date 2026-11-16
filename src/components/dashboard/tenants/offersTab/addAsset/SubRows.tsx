// react & next
import React from "react";

// external dependencies
import {
  Box,
  ListItemButton,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryToast,
  OrangeryReadOnlySwitch,
  OrangeryPrice
} from "../../../../OrangeryElements";

// queries & backend
import { IAsset } from "../../../../../queries/asset";

// icons, images & colors
import PlusIcon from "../../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../../assets/svg/cross.svg";

export default function SubRows({
  asset,
  selected,
  value,
  handleChange,
}: {
  asset: IAsset;
  selected: boolean;
  value: string[];
  handleChange: (value: string[]) => void;
}) {
  const handleToggle = (asset_id: string) => {
    const newValues = [...value];
    const index = newValues.findIndex((v) => v === asset_id);
    if (index === -1) {
      newValues.push(asset_id);
      if (asset_id) {
        OrangeryToast("Successfully added " + asset.name, "success");
      }
    } else {
      newValues.splice(index, 1);
      OrangeryToast("Successfully removed from the list " + asset.name, "success");
    }
    handleChange(newValues);
  };

  return (
    <>
      <ListItemButton
        onClick={() => handleToggle(asset.uuid)}
        sx={{
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
        }}
      >
        <Box className="column-align">
          <Typography>Serial Number</Typography>
          {asset.serial_number ? (
            <Box
              sx={{
                mr: 2,
                width: "100%",
                textAlign: "start",
                maxWidth: "40%",
                "& .serial-number": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <Typography variant="h4" className="serial-number">
                {asset.serial_number}
              </Typography>
            </Box>
          ) : (
            "-"
          )}
        </Box>
        <Box className="column-align">
          <Typography>Price</Typography>
          {asset.price ? (
            <Typography variant="h4">
              <OrangeryPrice euro={asset.price} germanFormat />
            </Typography>
          ) : (
            "-"
          )}
        </Box>
        <Box sx={{ width: "10%" }} />
        <Box className="column-align">
          <OrangeryReadOnlySwitch
            label={{ checked: "Active", unchecked: "Inactive" }}
            checked={asset.active}
          />
        </Box>

        {!selected && <PlusIcon className="plus-icon" />}
        {selected && <CrossIcon className="plus-icon" />}
      </ListItemButton>
    </>
  );
}
