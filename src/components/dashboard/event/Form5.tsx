import { Box, Divider, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryPrice, OrangeryText } from "../../OrangeryElements";
import { EventFieldsState } from "./EventForm";
import { AssetSummary } from "./form5/AssetSummary";
import { MeetingRoomSummary } from "./form5/MeetingRoomSummary";
import { ServiceSummary } from "./form5/ServiceSummary";
import { ShowAttendees } from "./form5/ShowAttendees";
import { ShowOrganizer } from "./form5/ShowOrganizer";
import { ShowPresenters } from "./form5/ShowPresenters";

export default function Form5({ state }: { state: EventFieldsState }) {
  const totalPrice = state.meeting_rooms.values?.reduce(
    (acc, item) => acc + item.value.price.value,
    0
  );
  const timeCalc = () => {
    const start = new Date(state.start_time.value).getTime();
    const end = new Date(state.end_time.value).getTime();

    const durationMs = end - start;

    const durationMinutes = Math.round(durationMs / (60 * 1000));

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return hours;
  };

  const timeDura = timeCalc();

  return (
    <form>
      <Observer>
        {() => (
          <Box
            sx={{
              "& .alignment": {
                pl: 4,
                pr: 3,
              },
            }}
          >
            <Typography
              sx={{
                "&:first-letter": { textTransform: "capitalize" },
                fontSize: "24px",
                fontWeight: 700,
                mb: 2,
                pl: 4,
                pr: 3,
              }}
            >
              {state.name.value}
            </Typography>
            <Typography
              sx={{
                "&:first-letter": { textTransform: "capitalize" },
              }}
              fontSize="14px"
              fontWeight={400}
              className="alignment"
              textAlign="justify"
              lineHeight={1.5}
            >
              {state.description.value}
            </Typography>
            <Divider sx={{ mt: 2 }} />

            <Box sx={{ display: "flex", alignItems: "center", pl: 4, pr: 3 }}>
              <Box
                sx={{
                  borderRight: "1px solid #C9CCD2",
                  flex: 1,
                  pt: 1,
                  height: "80px",
                }}
              >
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Address
                </Typography>
                <Typography
                  fontSize="19px"
                  fontWeight={700}
                  sx={{ "&:first-letter": { textTransform: "capitalize" } }}
                >
                  <OrangeryText text={state.location.value} limit={15} />
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRight: "1px solid #C9CCD2",
                  flex: 1,
                  px: 2,
                  pt: 1,
                  height: "80px",
                }}
              >
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Start
                </Typography>
                <Typography
                  fontSize="19px"
                  fontWeight={600}
                  whiteSpace="nowrap"
                >
                  {new Date(state.start_time.value).toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                  &nbsp;
                  {new Date(state.start_time.value).toLocaleString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRight: "1px solid #C9CCD2",
                  flex: 1,
                  px: 2,
                  pt: 1,
                  height: "80px",
                }}
              >
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  End
                </Typography>
                <Typography
                  fontSize="19px"
                  fontWeight={600}
                  whiteSpace="nowrap"
                >
                  {new Date(state.end_time.value).toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, pl: 2, pt: 1, height: "80px" }}>
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Recurring
                </Typography>
                <Typography fontSize="19px" fontWeight={600}>
                  {!state.is_weekly.value ? (
                    "one time"
                  ) : (
                    <Weekly state={state} />
                  )}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", alignItems: "center", pl: 4, pr: 3 }}>
              <Box sx={{ pt: 1, flex: 1, height: "80px" }}>
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Organizers
                </Typography>
                <ShowOrganizer state={state} />
              </Box>

              <Box
                sx={{
                  pt: 1,
                  flex: 1,
                  borderLeft: "1px solid #C9CCD2",
                  pl: 1,
                  height: "80px",
                }}
              >
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Presenters
                </Typography>
                <ShowPresenters state={state} />
              </Box>

              <Box
                sx={{
                  pt: 1,
                  flex: 1,
                  borderLeft: "1px solid #C9CCD2",
                  pl: 1,
                  height: "80px",
                }}
              >
                <Typography fontSize="15px" fontWeight={600} color="#A5AAB4">
                  Attendees
                </Typography>
                <ShowAttendees state={state} />
              </Box>
            </Box>
            <Divider />

            <EventCost state={state} />

            {state.meeting_rooms.values.length ? (
              <>
                <Divider />
                <MeetingRoomSummary state={state} />
              </>
            ) : (
              ""
            )}

            {state.assets.values.length ? (
              <>
                <Divider sx={{ my: 1 }} />
                <AssetSummary state={state} />
              </>
            ) : (
              ""
            )}

            {state.services.values.length ? (
              <>
                <Divider sx={{ my: 1 }} variant="fullWidth" />
                <ServiceSummary state={state} />
              </>
            ) : (
              ""
            )}

            <Box sx={{ borderBottom: "3px solid #C9CCD2", pt: 1 }} />
            <Typography
              fontSize="26px"
              fontWeight={700}
              color="#0E0F11"
              textAlign="right"
              pt={1.5}
              pr={3}
            >
              Total:
              {(
                state.meeting_rooms.values?.reduce(
                  (acc, item) => acc + item.value.price.value,
                  0
                ) *
                  timeDura +
                state.assets.values?.reduce(
                  (acc, item) =>
                    acc + item.value.quantity.value * item.value.price.value,
                  0
                ) +
                state.services.values?.reduce(
                  (acc, item) =>
                    acc + item.value.quantity.value * item.value.price.value,
                  0
                ) +
                state.price.value
              ).toFixed(2)}
              &nbsp;€
            </Typography>
          </Box>
        )}
      </Observer>
    </form>
  );
}

const EventCost = ({ state }: { state: EventFieldsState }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pl: 4,
          pr: 3,
          py: 2,
          justifyContent: "end",
        }}
      >
        <Typography
          fontSize="23px"
          fontWeight={700}
          color="#55585C"
          flexGrow={1}
        >
          Event Cost
        </Typography>
        <Typography fontSize="23px" fontWeight={700} color="#0E0F11">
          <Observer>
            {() => <OrangeryPrice euro={state.price.value} germanFormat />}
          </Observer>
        </Typography>
      </Box>
    </>
  );
};

const Weekly = ({ state }: { state: EventFieldsState }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        "& .weekly": {
          fontSize: "12px",
          fontWeight: 400,
        },
      }}
    >
      <Typography fontSize="19px" fontWeight={600} color="2B2E33">
        Weekly
      </Typography>
      <span className="weekly">{`(Repeat for ${state.weeks.value} week${
        state.weeks.value > 1 ? "s" : ""
      })`}</span>
    </Box>
  );
};
