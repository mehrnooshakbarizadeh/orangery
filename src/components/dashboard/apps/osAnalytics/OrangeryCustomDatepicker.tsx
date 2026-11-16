// 
import React from "react";

// 
import { Box, Button, TextField, IconButton, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// icons, images & colors
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function OrangeryCustomDatepicker({
  value,
  onChange
}: {
  value?: Date;
  onChange: (newValue: Date | undefined) => void;
}) {
  // const [open, setOpen] = React.useState(false);
  // const [hover, setHover] = React.useState(true);

  // const customInputRef = React.useRef();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        // onMouseOut={() => setHover(false)}
        // onMouseOver={() => setHover(value ? true : false)}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0,
          alignItems: "center",
          pr: 1
        }}
      >
        {/* {value &&
          <Box
            // onMouseOver={() => setHover(true)}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: .25
            }}
          >
            {hover &&
              <IconButton
                // onMouseOver={() => setHover(true)}
                onClick={() => { onChange(undefined) }}
                size="small"
                sx={{
                  minWidth: 0,
                  "& .icon": {
                    width: ".8rem",
                    height: ".8rem",
                    color: "#2ecae5",
                  },
                }}
              >
                <CrossIcon className={"icon"} />
              </IconButton>
            }
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#2ecae5",
              }}
            >
              {(new Date(value)).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </Typography>
          </Box>
        } */}
        <Box sx={{ width: 170, ml: "auto" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd.MM.yyyy"
              disablePast
              value={value ?? ""}
              onChange={(newValue: any) => {
                onChange(newValue);
              }}
              renderInput={({ placeholder, ...props }) => {
                return <TextField
                  placeholder=""  ////////!!!!!!!! not working!!!!
                  {...props}
                  fullWidth
                  // value={props.value ?? ""}
                  sx={{
                    "&.MuiTextField-root": {
                      // backgroundColor: "#f5f7fa",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "transparent"
                    },
                    "& .MuiOutlinedInput-input": {
                      gap: 1,
                      pl: 0,
                      pr: 3.5,
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#2ecae5",
                      borderRadius: 1,
                      backgroundColor: "transparent !important",
                      textAlign: "right"
                    },
                    "& .MuiOutlinedInput-root": {
                      pl: 0,
                      pr: 0,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    },
                    "& .MuiInputAdornment-root": {
                      position: "absolute",
                      right: 2
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#2ecae5",
                    }
                  }}
                />
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* <DatePicker
          onClose={() => { setOpen(false); }}
          open={open}
          value={value}
          PopperProps={{ anchorEl: customInputRef.current }}
          onChange={(newValue: any) => {
            onChange(newValue);
          }}
          renderInput={({
            ref,
            inputProps,
            disabled,
            onChange,
            value,
            ...other
          }) => {
            return <div ref={ref}>
              <IconButton
                onClick={() => { setOpen(!open); }}
                sx={{
                  "& .icon": {
                    width: "1.3rem",
                    height: "1.3rem",
                    color: "#2ecae5",
                  },
                }}
              >
                <CalendarMonthIcon className="icon" />
              </IconButton>
            </div>
          }}
        /> */}
      </Box>
    </LocalizationProvider>);
}