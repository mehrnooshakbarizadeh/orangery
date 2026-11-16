// contexts & globals
// import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
import { IOffice, useOffices } from "../../queries/office";

// icons, images & colors
import LocationIcon from "../../assets/svg/location-dot-white.svg";

export default function OrangeryOfficeAutocomplete({
  label,
  value,
  error,
  helperText,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string;
  error: boolean;
  helperText: React.ReactNode;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const {
    data: offices,
    isLoading,
    isError,
  } = useOffices();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "85px",
          position: "relative",
          "& .MuiOutlinedInput-root": {
            pl: 6,
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
          options={offices || []}
          renderOption={(props, option) => <li {...props} key={option.uuid}>{`${option.name}`}</li>}
          getOptionLabel={(option) => `${option.name}`}
          value={(offices ?? []).find((e: any) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValue) => {
            onChange(newValue?.uuid ?? "");
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          renderInput={(params) => (
            <TextField
              label={label}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              sx={{
                "& .MuiAutocomplete-input": { ml: 4 },
                // "&.MuiTextField-root": { backgroundColor: "#f5f7fa" },
              }}
            />
          )}
        />
        <LocationIcon className="icon" />
      </Box>
    </>
  );
}
