import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  IEvent,
  IOrganizerEvent,
  usePatchEvent,
  usePostEventModification,
} from "../../../../../../queries/event";
import { Observer } from "mobx-react-lite";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";
import {
  OrangeryTextAreaField,
  OrangeryTextField,
  OrangeryToast,
} from "../../../../../OrangeryElements";
import CrossIcon from "../../../../../../assets/svg/cross.svg";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import WeeklyRepeat from "../../../WeeklyReport";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";
import moment from "moment";

export default function EditForm({
  state,
  handleClose,
  event,
}: {
  state: OrganizerEventFieldsState;
  handleClose: () => void;
  event: IOrganizerEvent;
}) {
  const mutation = usePostEventModification();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        start_time: moment(state.start_time.value, moment.ISO_8601)
          .format()
          .slice(0, -6),
        end_time: moment(state.end_time.value, moment.ISO_8601)
          .format()
          .slice(0, -6),
        weeks: state.data.weeks,
      };
      const result = await mutation.mutateAsync(updateData);
      state.setResultDateTime(result);
      handleClose();
      if (event) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 3.5,
          // gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Date and Time
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 3, gap: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pl: 4,
          }}
        >
          <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
            Current
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography fontSize={22} fontWeight={700} color="#2B2E33">
              {new Date(event?.start_time!).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h24",
              })}
            </Typography>
            <Box
              sx={{
                height: "21px",
                "& .arrow-icon": { width: "1rem", height: "1rem" },
              }}
            >
              <ArrowRightIcon className="arrow-icon" />
            </Box>
            <Typography fontSize={22} fontWeight={700} color="#2B2E33">
              {new Date(event?.end_time!).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h24",
              })}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 1, ml: "130px" }}
        >
          <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
            Recurring
          </Typography>
          <Typography>
            {event.is_weekly ? (
              <Typography
                fontSize={19}
                fontWeight={600}
                sx={{ "& .repeat": { fontSize: "12px", fontWeight: 400 } }}
              >
                Weekly
                <span className="repeat">
                  {` (Repeat for ${event.weeks} week${
                    event.weeks! > 1 ? "s" : ""
                  })`}
                </span>
              </Typography>
            ) : (
              "One time"
            )}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: 5, mb: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
          Your Suggestion
        </Typography>

        <FormControl className="form-control" sx={{ mt: "35px", mb: "40px" }}>
          <Observer>
            {() => (
              <>
                <RadioGroup
                  row
                  name=""
                  value={state.is_weekly.value}
                  onChange={(e) => (state.is_weekly.value = e.target.value)}
                  sx={{
                    "& .Mui-checked": { color: "#074EE8" },
                  }}
                >
                  <Observer>
                    {() => (
                      <FormControlLabel
                        className="form-control-label"
                        value="one_time"
                        control={<Radio />}
                        label="One Time"
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <FormControlLabel
                        className="form-control-label"
                        value="weekly"
                        control={<Radio />}
                        label="Weekly"
                      />
                    )}
                  </Observer>
                </RadioGroup>
              </>
            )}
          </Observer>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 4,
            position: "relative",
          }}
        >
          <Observer>
            {() => (
              <>
                <Box sx={{ width: "33%" }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disablePast
                      label="CHOOSE DATE *"
                      value={state.start_time.value}
                      onChange={(newValue: any) => {
                        state.start_time.value = newValue;
                        state.end_time.value = newValue;
                      }}
                      renderInput={(props) => (
                        <TextField name="stat_time" {...props} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              </>
            )}
          </Observer>
          <Observer>
            {() => (
              <Box sx={{ width: "17%" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    showToolbar
                    label="START"
                    value={state.start_time.value}
                    onChange={(newValue: any) => {
                      state.start_time.value = newValue;
                    }}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        fullWidth
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Observer>
          <Observer>
            {() => (
              <Box sx={{ width: "17%" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    showToolbar
                    label="END"
                    value={state.end_time.value}
                    onChange={(newValue: any) => {
                      state.end_time.value = newValue;
                    }}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        fullWidth
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Observer>

          <Observer>
            {() => (
              <>
                {state.is_weekly.value === "weekly" && (
                  <WeeklyRepeat
                    state={state}
                    value={state.weeks.value}
                    onChange={(newValue: number) =>
                      (state.weeks.value = newValue)
                    }
                  />
                )}
              </>
            )}
          </Observer>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          pt: 2,
          borderTop: "1px solid #EDEEF0",
          display: "flex",
          gap: 2,
          pr: 2,
          position: "absolute",
          right: 0,
          bottom: "16px",
          justifyContent: "end",
          "& .add-btn": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <Button
          variant="text"
          onClick={handleClose}
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 5,
          }}
        >
          <Typography
            color="#2B2E33"
            sx={{
              "&.MuiTypography-root": {
                fontSize: "21px",
                fontWeight: 600,
              },
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 3,
            "& .submit": {
              fontSize: "21px",
              fontWeight: 600,
            },
          }}
          color="primary"
          variant="contained"
          disabled={mutation.isLoading}
        >
          <Typography className="submit">Send Request</Typography>
        </Button>
      </Box>
    </>
  );
}
