// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, IconButton, List, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import DeskCard from "./DeskCard";
import AssetCard from "./AssetCard";

// queries & backend
import { useDesks } from "../../../../queries/desk";
import { useAssetGroups } from "../../../../queries/asset";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";
import { IDoor, useDoors } from "../../../../queries/door";
import DoorCard from "./DoorCard";

export default function ListSelectedItems({
  assetValue,
  doorValue,
  deskValue,
  handleAssetChange,
  handleDoorChange,
  handleChange,
  handleClose,
}: {
  assetValue: string[];
  doorValue: string[];
  deskValue: string[];
  handleAssetChange: (value: string[]) => void;
  handleDoorChange: (value: string[]) => void;
  handleChange: (value: string[]) => void;
  handleClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const globalState = useGlobalState();
  const { data: desks } = useDesks({ office_uuid: globalState.office_uuid });
  const { data: assets } = useAssetGroups(globalState.office_uuid);
  const { data: doors } = useDoors(globalState.office_uuid);

  return (
    <>
      <Box
        sx={{
          pl: 2,
          py: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Observer>
              {() => (
                <Typography fontSize={15} fontWeight={700} color={"info.main"}>
                  {` ${
                    deskValue.length + assetValue.length + doorValue.length
                  } item${
                    deskValue.length + assetValue.length + doorValue.length > 1
                      ? "s"
                      : ""
                  }
                  selected`}
                </Typography>
              )}
            </Observer>

            <IconButton onClick={handleClose}>
              <CrossIcon className="cancel-icon" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          pl: 6,
          pr: 1,
          mr: 3,
          height: "calc(100% - 112px)",
          overflowY: "auto",
          display: "flex",
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
            "& .MuiListItem-root": {
              px: 0,
            },
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box sx={{ pb: "12px" }}>
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
            >
              {`Assets (${assetValue.length} Item${
                assetValue.length! > 1 ? "s" : ""
              })`}
            </Typography>
          </Box>
          {assets?.map((asset) => (
            <Box key={asset.name}>
              <Observer>
                {() => (
                  <AssetCard
                    handleChange={handleAssetChange}
                    value={assetValue}
                    asset={asset}
                    //   selected={!!value.find((v) => v === asset.name)}
                  />
                )}
              </Observer>
            </Box>
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
            >
              {`Desks (${deskValue.length} Item${
                deskValue.length! > 1 ? "s" : ""
              })`}
            </Typography>
          </Box>
          {desks?.map((desk) => (
            <Box key={desk.uuid}>
              <Observer>
                {() => (
                  <DeskCard
                    handleChange={handleChange}
                    value={deskValue}
                    desk={desk}
                    selected={!!deskValue.find((v) => v === desk.uuid)}
                  />
                )}
              </Observer>
            </Box>
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
            >
              {`Doors (${doorValue.length} Item${
                doorValue.length! > 1 ? "s" : ""
              })`}
            </Typography>
          </Box>
          {doors?.map((door) => (
            <Box key={door.lock_id}>
              <Observer>
                {() => (
                  <DoorCard
                    handleChange={handleDoorChange}
                    value={doorValue}
                    door={door}
                    selected={!!doorValue.find((v) => v === door.lock_id)}
                  />
                )}
              </Observer>
            </Box>
          ))}
        </List>
      </Box>
    </>
  );
}
