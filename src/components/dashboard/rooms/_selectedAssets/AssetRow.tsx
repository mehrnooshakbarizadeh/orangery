// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  OrangeryToast,
  OrangeryReadOnlySwitch,
  OrangeryPrice
} from "../../../OrangeryElements";

// queries & backend
import { IAsset } from "../../../../queries/asset";

// icons, images & colors
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";

export default function AssetRows({
  asset,
  value,
  selected,
  handleChange,
}: {
  asset: IAsset;
  value: string[];
  selected: boolean;
  handleChange: (value: string[]) => void;
}) {
  const globalState = useGlobalState();
  const [open, setOpen] = React.useState(false);

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
        role={undefined}
        onClick={() => handleToggle(asset.uuid)}
        dense
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
          "& .plus-icon": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <ListItemText className="column-align">
          <Typography variant="h6">Name</Typography>
          <Typography variant="h4">{asset.name}</Typography>
        </ListItemText>
        <ListItemText className="column-align">
          <Typography variant="h6">Serial Number</Typography>
          <Box
            sx={{
              mr: 2,
              width: "70%",
              textAlign: "start",
              maxWidth: "100%",
              "& .serial-number": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            {asset.serial_number ? (
              <Typography variant="h4" className="serial-number">
                {asset.serial_number}
              </Typography>
            ) : (
              <Typography variant="h4" className="serial-number">
                -
              </Typography>
            )}
          </Box>
        </ListItemText>
        <ListItemText className="column-align">
          <Typography variant="h6">Price</Typography>
          <Typography variant="h4">
            <OrangeryPrice euro={asset.price} germanFormat />
          </Typography>
        </ListItemText>
        <Box className="column-align">
          <OrangeryReadOnlySwitch
            label={{ checked: "Active", unchecked: "Inactive" }}
            checked={asset.active}
          />
        </Box>
        <Observer>
          {() => (
            <>
              {!selected && <PlusIcon className="plus-icon" />}
              {selected && <CrossIcon className="plus-icon" />}
            </>
          )}
        </Observer>
      </ListItemButton>
    </>
  );
}
