import { MpRounded } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { IEventMeetingRoom } from "../../../../queries/event";
import { useMeetingRooms } from "../../../../queries/meetingRoom";
import { OrangeryPrice, OrangeryTextField } from "../../../OrangeryElements";
import { AssetState, EventFieldsState, MeetingRoomState } from "../EventForm";
import ClockIcon from "../../../../assets/svg/clock.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";
import EventType from "./AssetType";

export default function AssetList({
  open,
  state,
}: {
  open: boolean;
  state: EventFieldsState;
}) {
  const globalState = useGlobalState();
  const { isLoading, data: meetingRooms } = useMeetingRooms(
    globalState.office_uuid
  );

  return (
    <>
      <Observer>
        {() => (
          <Collapse in={open} sx={{ pt: 2 }}>
            {state.assets.values?.map((asset, index) => (
              <EventAsset key={index} asset={asset.value} state={state} />
            ))}
          </Collapse>
        )}
      </Observer>
    </>
  );
}

const EventAsset = ({
  asset,
  state,
}: {
  asset: AssetState;
  state: EventFieldsState;
}) => {
  // const globalState = useGlobalState();
  // const { isLoading, data: meetingRooms } = useMeetingRooms(
  //   globalState.office_uuid
  // );
  // const selected_meetingroom = meetingRooms?.find(
  //   (m) => m.uuid === room.data.uuid
  // );
  const handleDrop = () => {
    const index = state.assets.values.findIndex((v) => v.value === asset);
    state.assets.deleteElementValue(index);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          // justifyContent: "end",
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
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
          "& .sub-title": { fontSize: 16, fontWeight: 400, color: "#2B2E33" },
        }}
      >
        <Box sx={{ flexBasis: "20%" }}>
          <Typography className="title">Name</Typography>
          <Typography className="sub-title">
            {asset?.data.grouped_name ? asset?.data.grouped_name : "-"}
          </Typography>
        </Box>

        <Box sx={{ flexBasis: "17%" }}>
          {/* <Typography className="title">Type</Typography> */}
          <Observer>
            {() => (
              <EventType
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
              <NumberFormat
                customInput={TextField}
                label="QUANTITY"
                type="text"
                allowNegative={false}
                value={asset.quantity.value?.toString()}
                error={!!asset.quantity.error}
                helperText={asset.quantity.error}
                onChange={(e: any) =>
                  (asset.quantity.value = parseInt(e.target.value))
                }
                sx={{ width: "100%" }}
              />
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
                    // value={state.price.value?.toString()}
                    // prefix="$"
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
                    // helperText={state.price.error}
                    onChange={(e: any) =>
                      (asset.price.value = parseFloat(e.target.value))
                    }
                    sx={{ width: "100%" }}
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
                  <Typography fontSize="16px" fontWeight={700} color="#2B2E33">
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
      </Box>
    </>
  );
};
