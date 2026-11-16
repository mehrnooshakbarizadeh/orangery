// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, IconButton, List, ListItem, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../../OrangeryElements";
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
  const { isLoading, data: availableAssets } = useAssets({
    office_uuid: globalState.office_uuid,
    status: "available",
    // status: "rentable",
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          "& .cancel-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "black",
          },
          "& .header": {
            display: "flex",
            justifyContent: "end",
            pt: "32px",
            pr: 2,
            pl: 6,
          },
          "& .empty-box": { flexGrow: 1 },
        }}
      >
        <Box className="header">
          <Typography className="empty-box" variant="h1">
            Add Asset
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>

        {isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : availableAssets && availableAssets.length > 0 ? (
          <Box
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              borderRadius: 1.5,
              mt: 2,
              mb: 2,
              pl: 6,
              pr: 1,
              mr: 3,
              // minHeight: 666,
              height: `calc(100% - 112px)`,
              overflowY: "auto", // Make it scroll!
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
            }}
          >
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              {availableAssets?.map((asset) => (
                <AssetRows
                  handleChange={handleChange}
                  value={value}
                  key={asset.uuid}
                  asset={asset}
                  selected={!!value.find((v) => v === asset.uuid)}
                />
              ))}
            </List>
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              borderRadius: 1.5,
              mt: 2,
              mb: 2,
              pl: 6,
              pr: 1,
              mr: 3,
            }}
          >
            No asset is available.
          </Box>
        )}
      </Box>
    </>
  );
}
