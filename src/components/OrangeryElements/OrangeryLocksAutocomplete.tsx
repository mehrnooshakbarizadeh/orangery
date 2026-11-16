// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Autocomplete,
  Box,
  TextField,
  InputAdornment
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryCircleLoading,
  OrangeryTextField
} from "../OrangeryElements";

// queries & backend
import { useLocks } from "../../queries/apps/saltoKs";

// icons, images & colors
import SearchIcon from "../../assets/svg/search.svg";

export default function OrangeryLocksAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const {
    data: locks,
    isLoading,
    isError,
  } = useLocks();

  return (!isLoading
    ? <Box
      sx={{
        width: "100%",
        height: "85px",
        position: "relative",
        "& .MuiOutlinedInput-root": {
          pl: 7,
        },
        "& .icon": {
          mr: 2,
          ml: 1,
          position: "absolute",
          width: "1.125rem",
          height: "1.125rem",
          color: "grey.A200",
          top: (theme) => theme.spacing(2.3),
          left: (theme) => theme.spacing(1),
        },
      }}
    >
      <Autocomplete
        options={locks || []}
        renderOption={(props, option) => <li {...props}>{`${option.lock_name}`}</li>}
        getOptionLabel={(option) => `${option.lock_name}`}
        multiple
        value={(locks ?? []).filter((e) => value?.indexOf(e.lock_id) !== -1)}
        onChange={(_, newValues) => {
          onChange(newValues.map((e) => e.lock_id));
        }}
        isOptionEqualToValue={(option, value) => option.lock_id === value.lock_id}
        renderInput={(params) => (
          <TextField
            label={label}
            {...params}
            InputLabelProps={{
              ...params.InputLabelProps,
              shrink: true,
            }}
            placeholder="Assign doors..."
            sx={{
              "& .MuiAutocomplete-input": { pl: 2 },
              "& .MuiOutlinedInput-root": { pl: "40px !important" },
              // "&.MuiTextField-root": { backgroundColor: "#f5f7fa" },
            }}
          />
        )}
      />
      <Box
        sx={{
          "& .icon": {
            width: "1.3rem",
            gap: 0.5,
            color: "grey.A200"
          }
        }}
      >
        <SearchIcon className="icon" />
      </Box>
    </Box>
    : <OrangeryTextField
      fullWidth
      label={label}
      placeholder={"Loading options..."}
      InputLabelProps={{
        shrink: true,
      }}
      startIcon={<OrangeryCircleLoading />}
      // InputProps={{
      //   startAdornment: (
      //     <InputAdornment
      //       position="start"
      //       sx={{ width: "1.3rem", gap: 0.5, color: "grey.A200" }}
      //     >
      //       <OrangeryCircleLoading />
      //     </InputAdornment>
      //   ),
      // }}
      sx={{
        "& .MuiInputAdornment-root": {
          position: "absolute",
          left: (theme) => theme.spacing(2),
        },
        "& .MuiOutlinedInput-input": {
          fontSize: 15,
          fontWeight: 600,
          gap: 1,
          color: "grey.A700",
          pl: "40px !important"
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "grey.A100",
        },
        "& .MuiFormHelperText-root": { color: "error.main" },
      }}
    />
  );
}
