import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { observer, Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { OrangeryPrice } from "../../../OrangeryElements";
import CrossIcon from "../../../../assets/svg/cross.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";
import AssetType from "./AssetType";
import { AssetState, MeetingRoomState } from "../HandleRoomForm";
import React, { useEffect, useRef } from "react";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { IAssetGroup, useAssetGroupsRentable } from "../../../../queries/asset";
import { IMeetingRoom, useMeetingRoom } from "../../../../queries/meetingRoom";

export default function AssetList({
  open,
  state,
  meetingRoom,
}: {
  open: boolean;
  state: MeetingRoomState;
  meetingRoom?: IMeetingRoom;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Collapse in={open} sx={{ pt: 2 }}>
            {state.assets.values
              ?.slice()
              .sort((a, b) =>
                a.value.grouped_name.value > b.value.grouped_name.value ? 1 : -1
              )
              .map((asset, index) => (
                <EventAsset
                  key={index}
                  meetingRoom={meetingRoom}
                  asset={asset.value}
                  state={state}
                />
              ))}
          </Collapse>
        )}
      </Observer>
    </>
  );
}

const EventAsset = observer(
  ({
    asset,
    state,
    meetingRoom,
  }: {
    asset: AssetState;
    state: MeetingRoomState;
    meetingRoom?: IMeetingRoom;
  }) => {
    const globalState = useGlobalState();
    const { data: assetsGroups } = useAssetGroupsRentable(
      globalState.office_uuid
    );

    const initialStock = () => {
      let initialGetStock = 0;

      const sameAssetNameGet =
        meetingRoom?.assets.filter(
          (as) => as.grouped_name === asset.grouped_name.value
        ) || [];

      const sumQuantities = sameAssetNameGet.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const assetGroupStock =
        assetsGroups?.find((ag) => ag.name === asset.grouped_name.value)
          ?.stock || 0;

      if (sameAssetNameGet) {
        initialGetStock = assetGroupStock + sumQuantities;
        return initialGetStock;
      }
      return initialGetStock;
    };

    const handleDrop = () => {
      const index = state.assets.values.findIndex((v) => v.value === asset);
      state.assets.deleteElementValue(index);
    };

    const samePriceName = () => {
      let valuable = true;
      const sameName = state.assets.values.find(
        (as) =>
          as.value.grouped_name.value === asset.grouped_name.value &&
          as.value.asset_type.value === "Optional"
      );
      if (sameName) {
        if (sameName.value.price.value !== asset.price.value) {
          valuable = false;
        }
      }
      return valuable;
    };

    const sameAssetNameQuantityValues = () => {
      const sameNameAssetQuantities = state.assets.values
        .filter(
          (as) => as.value.grouped_name.value === asset.grouped_name.value
        )
        .reduce((acc, item) => acc + item.value.quantity.value, 0);
      return sameNameAssetQuantities;
    };

    return (
      <>
        <Observer>
          {() => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                // justifyContent: "end",
                boxShadow: "1px 1px 8px #0000000a",
                border:
                  sameAssetNameQuantityValues() > initialStock() ||
                  (asset.asset_type.value === "optional" && !samePriceName())
                    ? "1px solid #FF3D00"
                    : "1px solid rgb(210 215 221)",
                backgroundColor: "#fff",
                transition: "0.2s",
                transitionTimingFunction: "ease-in-out",
                borderRadius: 1.5,
                mb: 1.2,
                mx: 0,
                py: 2.7,
                px: 2.4,
                flexWrap: "wrap",
                "& .title": { fontSize: 12, fontWeight: 600, color: "#9A9CA0" },
                "& .sub-title": {
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#2B2E33",
                },
              }}
            >
              <Box sx={{ flexBasis: "20%" }}>
                <Typography className="title">Name</Typography>
                <Typography className="sub-title">
                  {asset?.data.grouped_name}
                </Typography>
              </Box>

              <Box sx={{ flexBasis: "17%" }}>
                <Observer>
                  {() => (
                    <AssetType
                      label="TYPE"
                      name="event_type"
                      placeholder="Included"
                      error={!!asset.asset_type.error}
                      value={asset.asset_type.value}
                      helperText={asset.asset_type.error}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        (asset.asset_type.value = e.target.value)
                      }
                    />
                  )}
                </Observer>
              </Box>

              <Box sx={{ flexBasis: "17.3%" }}>
                <Observer>
                  {() => (
                    <>
                      <NumberFormat
                        customInput={TextField}
                        label="QUANTITY"
                        type="text"
                        allowNegative={false}
                        value={asset.quantity.value}
                        // error={!!asset.quantity.error}
                        placeholder="enter correct number"
                        onChange={(e: any) => {
                          asset.quantity.value = parseInt(e.target.value);
                        }}
                        sx={{
                          width: "100%",

                          "& .fixed": {
                            color: "#2B2E33",
                          },
                          "& .MuiOutlinedInput-input": {
                            color:
                              sameAssetNameQuantityValues() > initialStock()
                                ? "#FF3D00"
                                : "black",
                          },
                        }}
                      />
                    </>
                  )}
                </Observer>
              </Box>

              <Observer>
                {() => (
                  <>
                    {asset.asset_type.value === "Optional" && (
                      <Box sx={{ flexBasis: "17.3%" }}>
                        <NumberFormat
                          thousandsGroupStyle="wan"
                          fixedDecimalScale={true}
                          value={asset.price.value?.toString()}
                          decimalSeparator="."
                          customInput={TextField}
                          fullWidth
                          label="PRICE"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  "& .euro-icon": { width: "0.75rem" },
                                }}
                              >
                                <EuroIcon className="euro-icon" />
                              </InputAdornment>
                            ),
                          }}
                          type="text"
                          thousandSeparator={false}
                          allowNegative={false}
                          decimalScale={2}
                          error={!!state.price.error}
                          helperText={state.price.error}
                          onChange={(e: any) =>
                            (asset.price.value = parseFloat(e.target.value))
                          }
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-input": {
                              color: !samePriceName() ? "#FF3D00" : "black",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Observer>
              <Observer>
                {() => (
                  <>
                    {asset.asset_type.value === "Included" && (
                      <Box sx={{ flexBasis: "17.3%" }} />
                    )}
                  </>
                )}
              </Observer>

              <Observer>
                {() => (
                  <>
                    {asset.asset_type.value === "Optional" && (
                      <Box sx={{ flexBasis: "10%", textAlign: "center" }}>
                        <Typography className="title">Total Price</Typography>
                        <Typography
                          fontSize="16px"
                          fontWeight={700}
                          color="#2B2E33"
                          whiteSpace="nowrap"
                        >
                          <OrangeryPrice
                            euro={asset?.price.value * asset.quantity.value}
                            germanFormat
                          />
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Observer>
              <Observer>
                {() => (
                  <>
                    {asset.asset_type.value === "Included" && (
                      <Box sx={{ flexBasis: "10%" }} />
                    )}
                  </>
                )}
              </Observer>

              <IconButton
                onClick={handleDrop}
                sx={{
                  "& .cancel-icon": {
                    width: "1.3rem",
                    height: "1.3rem",
                  },
                }}
              >
                <CrossIcon className="cancel-icon" />
              </IconButton>
              <Box>
                <Observer>
                  {() => (
                    <Typography
                      variant="h1"
                      color="#FF3D00"
                      sx={{ fontSize: 14, fontWeight: 600, mb: 1.2 }}
                    >
                      {sameAssetNameQuantityValues() > initialStock()
                        ? `Total quantity cannot be more than available stock (${initialStock()}) for "${
                            asset.grouped_name.value
                          }" group of assets.`
                        : ""}
                    </Typography>
                  )}
                </Observer>
                <Observer>
                  {() => (
                    <Typography
                      variant="h1"
                      color="#FF3D00"
                      sx={{ fontSize: 14, fontWeight: 600, mb: 1.2 }}
                    >
                      {asset.asset_type.value === "Optional" && !samePriceName()
                        ? "Different prices can not be selected for the same group of assets."
                        : ""}
                    </Typography>
                  )}
                </Observer>
              </Box>
            </Box>
          )}
        </Observer>
      </>
    );
  }
);
