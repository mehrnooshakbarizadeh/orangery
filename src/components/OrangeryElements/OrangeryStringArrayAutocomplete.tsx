// contexts & globals
// import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
//

// icons, images & colors
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function OrangeryStringArrayAutocomplete({
  value,
  options,
  label,
  placeholder,
  onChange,
}: {
  value: string[];
  options: string[];
  label: string;
  placeholder?: string;
  onChange: (value: string[]) => void;
}) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "85px",
          position: "relative",
          // "& .MuiOutlinedInput-root": {
          //   pl: 6,
          // },
          // "& .icon": {
          //   mr: 2,
          //   ml: 1,
          //   position: "absolute",
          //   width: "1.125rem",
          //   height: "1.125rem",
          //   color: "grey.A200",
          //   top: (theme) => theme.spacing(2.3),
          //   left: (theme) => theme.spacing(1),
          // },
        }}
      >
        <Autocomplete
          options={options || []}
          renderOption={(props, option) => <li {...props}>{`${option.replace("_", " ")}`}</li>}
          getOptionLabel={(option) => `${option.replace("_", " ")}`}
          multiple
          value={(options ?? []).filter((e) => value?.indexOf(e) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e));
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              placeholder={placeholder ?? "Assign..."}
              sx={{
                "& .MuiAutocomplete-input": { ml: 2 },
                // "&.MuiTextField-root": { backgroundColor: "#f5f7fa" },
              }}
            />
          )}
        />
        {/* <LocalOfferIcon className="icon" /> */}
      </Box>
    </>
  );
}