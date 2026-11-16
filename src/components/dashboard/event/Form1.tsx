import {
  Box,
  FormControl,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Observer, observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import {
  OrangeryTextAreaField,
  OrangeryTextField,
} from "../../OrangeryElements";
import { EventFieldsState } from "./EventForm";
import EuroIcon from "../../../assets/svg/euro.svg";
import PlusIcon from "../../../assets/svg/plus.svg";
import RefreshIcon from "../../../assets/svg/refresh.svg";
import RemoveIcon from "@mui/icons-material/Remove";
import OrangeryOfficesAutocomplete from "../../OrangeryElements/OrangeryOfficesAutocomplete";
import { useEffect, useState } from "react";
import { DateRange } from "@mui/lab";
import WeeklyRepeat from "./WeeklyReport";

export default function Form1({ state }: { state: EventFieldsState }) {
  return (
    <>
      <form>
        <Observer>
          {() => (
            <Box sx={{ mb: 1 }}>
              <OrangeryTextField
                label="EVENT TITLE *"
                name="title"
                placeholder="Enter Event Title"
                value={state.name.value}
                error={!!state.name.error}
                helperText={state.name.error}
                onChange={(e: any) => (state.name.value = e.target.value)}
              />
            </Box>
          )}
        </Observer>
        <Observer>
          {() => (
            <OrangeryTextAreaField
              sx={{
                width: "100%",
                height: "118px",
                mb: 4,
              }}
              editorHeight="5.9rem"
              label="EVENT DESCRIPTION *"
              name="description"
              multiline
              placeholder="Write somthing about the event"
              error={!!state.description.error}
              value={state.description.value}
              helperText={state.description.error}
              onChange={(e: any) => (state.description.value = e.target.value)}
            />
          )}
        </Observer>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 3 }}>
          <Observer>
            {() => (
              <OrangeryTextField
                label="LOCATION ADDRESS"
                name="location"
                placeholder="Enter location address"
                error={!!state.location.error}
                value={state.location.value}
                helperText={state.location.error}
                onChange={(e: any) => (state.location.value = e.target.value)}
              />
            )}
          </Observer>
          <Observer>
            {() => (
              <OrangeryTextField
                label="EVENT URL(FOR ONLINE EVENTS)"
                name="link"
                placeholder="Enter event url"
                error={!!state.event_link.error}
                value={state.event_link.value}
                helperText={state.event_link.error}
                onChange={(e: any) => (state.event_link.value = e.target.value)}
              />
            )}
          </Observer>
        </Box>

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
                    // dateRanges={dates}
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: "33%" }}>
            <Observer>
              {() => (
                <NumberFormat
                  disabled={state.is_free.value}
                  thousandsGroupStyle="wan"
                  fixedDecimalScale={true}
                  value={state.price.value}
                  decimalSeparator="."
                  customInput={TextField}
                  fullWidth
                  label="PRICE"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ "& .euro-icon": { width: "0.75rem" } }}
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
                    (state.price.value = parseFloat(e.target.value))
                  }
                />
              )}
            </Observer>
          </Box>
          <Box sx={{ width: "35%" }}>
            <Observer>
              {() => (
                <NumberFormat
                  disabled={state.is_free.value}
                  thousandsGroupStyle="wan"
                  fixedDecimalScale={true}
                  value={state.attendee_price.value}
                  decimalSeparator="."
                  customInput={TextField}
                  fullWidth
                  label="PRICE FOR EACH ATTENDEE"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ "& .euro-icon": { width: "0.75rem" } }}
                      >
                        <EuroIcon className="euro-icon" />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={2}
                  error={!!state.attendee_price.error}
                  helperText={state.attendee_price.error}
                  onChange={(e: any) =>
                    (state.attendee_price.value = parseFloat(e.target.value))
                  }
                />
              )}
            </Observer>
          </Box>
        </Box>
        <Box sx={{ width: "100%", mt: 5.3 }}>
          <Observer>
            {() => (
              <OrangeryOfficesAutocomplete
                label="Recommend this event in these locations"
                values={state.featured_in.values.map((e) => e.value)}
                onChange={(newValues) => {
                  newValues.forEach((e) => {
                    const i = state.featured_in.values.findIndex(
                      (v) => v.value === e
                    );
                    if (i === -1) {
                      state.featured_in.pushElementValue(e);
                    }
                  });
                  state.featured_in.values.forEach((v, j) => {
                    const i = newValues.findIndex((e) => v.value === e);
                    if (i === -1) {
                      state.featured_in.deleteElementValue(j);
                    }
                  });
                }}
              />
            )}
          </Observer>
        </Box>
      </form>
    </>
  );
}
