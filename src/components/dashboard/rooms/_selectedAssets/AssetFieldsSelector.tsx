// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, IconButton, List, ListItem } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import AssetRows from "./AssetRow";

// queries & backend
import { useAssets } from "../../../../queries/asset";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function AssetFieldsSelector({
  value,
  handleChange,
  handleClose,
}: {
  value: string[];
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const globalState = useGlobalState();
  const { data: availableAssets } = useAssets({
    office_uuid: globalState.office_uuid,
    status: "available",
  });

  return (
    <>
      <Box
        sx={{
          gap: 1,
          display: "flex",
          flexDirection: "column",
          "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          "& .header": {
            display: "flex",
            justifyContent: "end",
            py: "12px",
            px: 1,
          },
          "& .empty-box": { flexGrow: 1 },
        }}
      >
        <Box className="header">
          <Box className="empty-box" />
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>

        <List
          sx={{
            pl: 2,
            mr: 3,
            height: "calc(100vh - 229px)",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            // rowGap: 2,
            width: "99%",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {},
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          {availableAssets?.map((asset) => (
            <ListItem key={asset.uuid}>
              <Observer>
                {() => (
                  <AssetRows
                    handleChange={handleChange}
                    value={value}
                    asset={asset}
                    selected={!!value.find((v) => v === asset.uuid)}
                  />
                )}
              </Observer>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
