// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, IconButton, List, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import DeskItem from "./DeskItem";
import AssetItem from "./AssetItem";

// queries & backend
import { useDesks } from "../../../../queries/desk";
import { useAssetGroups } from "../../../../queries/asset";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";

export default function ListSelectedItems({
  assetValue,
  value,
  handleAssetChange,
  handleChange,
  handleClose,
}: {
  assetValue: string[];
  value: string[];
  handleAssetChange: (value: string[]) => void;
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const globalState = useGlobalState();
  const { data: desks } = useDesks({ office_uuid: globalState.office_uuid });
  const { data: assets } = useAssetGroups(globalState.office_uuid);

  return (
    <>
      <Box
        sx={{
          pl: 5,
          pt: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              pr: 1,
              "& .cancel-icon": {
                width: "1.3rem",
                height: "1.3rem",
                color: "black",
              },
            }}
          >
            <Typography variant="h1" sx={{ flexGrow: 1 }}>
              Included Items Overview
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Observer>
                {() => (
                  <Typography
                    fontSize={15}
                    fontWeight={700}
                    color={"info.main"}
                  >
                    {value.length + assetValue.length} items selected
                  </Typography>
                )}
              </Observer>
              <IconButton onClick={handleClose}>
                <CrossIcon className="cancel-icon" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <List
        sx={{
          // pl: 2,
          px: 6,
          // mr: 3,
          // gap: 1,
          height: "calc(100vh - 229px)",
          display: "flex",
          flexDirection: "column",
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
        <Box sx={{ pt: 3, pb: "12px" }}>
          <Box
            sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }}
          />
          <Typography
            fontSize={15}
            fontWeight={700}
            sx={{ mt: -2, backgroundColor: "white", width: "13%" }}
          >{`Assets (${assetValue?.length} Items)`}</Typography>
        </Box>

        {assets?.map((asset) => (
          <AssetItem
            key={asset.name}
            handleChange={handleAssetChange}
            value={assetValue}
            asset={asset}
            //   selected={!!value.find((v) => v === asset.name)}
          />
        ))}
        <Box sx={{ pt: 3, pb: "12px" }}>
          <Box
            sx={{
              border: "none",
              borderTop: "2px dotted #D2D3D6",
            }}
          />
          <Typography
            fontSize={15}
            fontWeight={700}
            sx={{ mt: -2, backgroundColor: "white", width: "13%" }}
          >{`Desks (${value?.length} Items)`}</Typography>
        </Box>
        {desks?.map((desk) => (
          <Box key={desk.uuid}>
            <Observer>
              {() => (
                <DeskItem
                  handleChange={handleChange}
                  value={value}
                  desk={desk}
                  selected={!!value.find((v) => v === desk.uuid)}
                />
              )}
            </Observer>
          </Box>
        ))}
      </List>
    </>
  );
}
