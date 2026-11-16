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
import {
  OrangeryPrice,
  OrangeryText,
  OrangeryTextField,
} from "../../../OrangeryElements";
import { EventFieldsState, MeetingRoomState, ServiceState } from "../EventForm";
import ClockIcon from "../../../../assets/svg/clock.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import EuroIcon from "../../../../assets/svg/euro.svg";

export default function ServicesList({
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
            {state.services.values?.map((service) => (
              <EventService
                key={service.value.uuid.value}
                service={service.value}
                state={state}
              />
            ))}
          </Collapse>
        )}
      </Observer>
    </>
  );
}

const EventService = ({
  service,
  state,
}: {
  service: ServiceState;
  state: EventFieldsState;
}) => {
  const globalState = useGlobalState();
  const handleDrop = () => {
    const index = state.services.values.findIndex((v) => v.value === service);
    state.services.deleteElementValue(index);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
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
        <Observer>
          {() => (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <Typography className="title">Service Partner</Typography>
                <Typography className="sub-title">
                  <OrangeryText text={service.partner_name.value} limit={10} />
                </Typography>
              </Box>
            </>
          )}
        </Observer>
        <Observer>
          {() => (
            <Box sx={{ flexBasis: "17.3%", mb: 1 }}>
              <OrangeryTextField
                label="NAME"
                name="name"
                noHeight
                placeholder="Enter Service Name"
                value={service.service_name.value}
                error={!!service.service_name.error}
                helperText={service.service_name.error}
                onChange={(e: any) =>
                  (service.service_name.value = e.target.value)
                }
              />
            </Box>
          )}
        </Observer>

        <Box sx={{ flexBasis: "17.3%" }}>
          <Observer>
            {() => (
              <NumberFormat
                thousandsGroupStyle="wan"
                fixedDecimalScale={true}
                value={service.price.value?.toString()}
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
                onChange={(e: any) =>
                  (service.price.value = parseFloat(e.target.value))
                }
                sx={{ width: "100%" }}
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
                value={service.quantity.value?.toString()}
                error={!!service.quantity.error}
                helperText={service.quantity.error}
                onChange={(e: any) =>
                  (service.quantity.value = parseInt(e.target.value))
                }
                sx={{ width: "100%" }}
              />
            )}
          </Observer>
        </Box>

        <Box sx={{ flexBasis: "11%", textAlign: "center" }}>
          <Typography className="title">Total Price</Typography>
          <Observer>
            {() => (
              <Typography fontSize="16px" fontWeight={700} color="#2B2E33">
                <OrangeryPrice
                  euro={service?.price.value * service.quantity.value}
                  germanFormat
                />
              </Typography>
            )}
          </Observer>
        </Box>

        {/* <Observer>
          {() => (
            <Box sx={{ mb: 1 }}>
              <OrangeryTextField
                label="EMAIL"
                name="email"
                noHeight
                placeholder="Enter Service Email"
                value={service.email.value}
                error={!!service.email.error}
                helperText={service.email.error}
                onChange={(e: any) => (service.email.value = e.target.value)}
              />
            </Box>
          )}
        </Observer> */}

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
