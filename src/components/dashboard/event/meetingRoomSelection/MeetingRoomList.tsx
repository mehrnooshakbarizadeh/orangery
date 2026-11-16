import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { OrangeryPrice, OrangeryText } from "../../../OrangeryElements";
import { EventFieldsState, MeetingRoomState } from "../EventForm";
import ClockIcon from "../../../../assets/svg/clock.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useAvailableMeetingRooms } from "../../../../queries/meetingRoom";

export default function MeetingRoomList({
  open,
  state,
}: {
  open: boolean;
  state: EventFieldsState;
}) {
  return (
    <>
      <Observer>
        {() => (
          <Collapse in={open} sx={{ pt: 2 }}>
            {state.meeting_rooms.values?.map((room, index) => (
              <EventMeetingRoom
                key={room.value.uuid.value}
                room={room.value}
                state={state}
              />
            ))}
          </Collapse>
        )}
      </Observer>
    </>
  );
}

const EventMeetingRoom = ({
  room,
  state,
}: {
  room: MeetingRoomState;
  state: EventFieldsState;
}) => {
  const globalState = useGlobalState();
  const { isLoading, data: meetingRooms } = useAvailableMeetingRooms(
    globalState.office_uuid,
    new Date(state.start_time.value).toISOString().slice(0, -1),
    new Date(state.end_time.value).toISOString().slice(0, -1),
    state.weeks.value
  );

  // const mr = meetingRooms?.find((f) => f.uuid === room.uuid.value);
  // console.log(room.assets.values.length);
  const handleDrop = () => {
    const index = state.meeting_rooms.values.findIndex((v) => v.value === room);
    state.meeting_rooms.deleteElementValue(index);
  };

  const timeCalc = () => {
    const start_time = new Date(state.start_time.value);
    const end_time = new Date(state.end_time.value);
    const diffInMs = end_time.getTime() - start_time.getTime();
    const diffInHours = diffInMs / 3600000;

    return diffInHours;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "end",
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
          "& .sub-title": {
            fontSize: 16,
            fontWeight: 400,
            color: "#2B2E33",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 8 }}
        >
          <Box sx={{ width: "48%" }}>
            <Typography className="title">Room Name</Typography>
            <Typography className="sub-title">
              <OrangeryText text={room.name.value} limit={20} />
            </Typography>
          </Box>

          <Box>
            <Typography className="title">Assets</Typography>
            <Typography className="sub-title">
              {room.assets.values.length}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexBasis: "17.3%" }}>
          <Observer>
            {() => (
              <NumberFormat
                thousandsGroupStyle="wan"
                fixedDecimalScale={true}
                value={room.price.value?.toString()}
                decimalSeparator="."
                customInput={TextField}
                fullWidth
                label="PRICE/HOUR"
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
                onChange={(e: any) => {
                  room.price.value = parseFloat(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            )}
          </Observer>
        </Box>

        <Box sx={{ flexBasis: "10%" }}>
          <Typography className="title">Duration</Typography>
          <Observer>
            {() => (
              <>
                <Typography className="sub-title">{timeCalc()}</Typography>
              </>
            )}
          </Observer>
        </Box>

        <Box sx={{ flexBasis: "10%" }}>
          <Typography className="title">Repeat</Typography>
          <Observer>
            {() => (
              <>
                <Typography className="sub-title">
                  {" "}
                  {state.weeks.value}
                </Typography>
              </>
            )}
          </Observer>
        </Box>

        <Box sx={{ flexBasis: "11%", textAlign: "center" }}>
          <Typography className="title">Total Price</Typography>
          <Observer>
            {() => (
              <Typography fontSize="16px" fontWeight={700} color="#2B2E33">
                <OrangeryPrice
                  euro={room?.price.value * timeCalc()}
                  germanFormat
                />
              </Typography>
            )}
          </Observer>
        </Box>

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
