// react & next
import React, { useState, useMemo } from 'react'

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";

export interface IOption {
  value: string;
  label: string;
}

export default function OrangeryAutocomplete({
  options,
  helperText,
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  icon,
  disabled,
}: {
  options: IOption[];
  disabled?: boolean;
  icon?: React.ReactNode;
  helperText?: React.ReactNode;
  name: string;
  placeholder?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          "& .MuiOutlinedInput-root": {
            pl: 4,
          },
          "& .icon": {
            mr: 2,
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
          options={options || []}
          renderOption={(props, option) => <li {...props}>{option.label}</li>}
          getOptionLabel={(option) => option.label}
          value={(options ?? []).find((e: any) => value?.indexOf(e.label) !== -1)}
          onChange={(_, newValue) => {
            onChange(newValue?.value ?? "");
          }}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label ?? ""}
              name={name}
              error={error ?? false}
              helperText={helperText ?? ""}
              placeholder={placeholder ?? ""}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ width: "1.3rem", gap: 0.5, color: "grey.A200" }}
                  >
                    {icon}
                  </InputAdornment>
                ),
              }}
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
                },
                "& .MuiAutocomplete-input": { pl: "40px !important" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.A100",
                },
                "& .MuiFormHelperText-root": { color: "error.main" },
              }}
            />
          )}
        />
        {/* <UserIcon className="icon" /> */}
      </Box>
    </>
  );
}
