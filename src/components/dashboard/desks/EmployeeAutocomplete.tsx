// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import AngleDown from "../../../assets/svg/angleBoldDown.svg";

// external dependencies
import { Autocomplete, AutocompleteProps, Box, InputAdornment, SxProps, TextField, Theme } from "@mui/material";

// queries & backend
import { useEmployees } from "../../../queries/employee";

export default function EmployeeAutocomplete({
  helperText,
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  icon,
  disabled,
  sx,
}: {
  sx?: SxProps<Theme> | undefined,
  disabled?: boolean;
  icon: React.ReactNode;
  helperText: React.ReactNode;
  name: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
}) {
  const globalState = useGlobalState();
  const {
    data: employees,
    isLoading,
    isError,
  } = useEmployees(globalState.office_uuid);

  return (
    <>
      <Box
        sx={{
          ...sx,
          width: "100%",
          position: "relative",
          "& .MuiOutlinedInput-root": {
            pl: 4,
          },
          "& .icon-angleDown": {width: '1rem', height: '1rem'},
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
          options={employees || []}
          popupIcon={<AngleDown className="icon-angleDown"/>}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          value={(employees ?? []).find((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValue) => {
            onChange(newValue?.uuid ?? "");
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value?.uuid}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              name={name}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
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
                "& .MuiAutocomplete-endAdornment": {right: '16px !important'},
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
