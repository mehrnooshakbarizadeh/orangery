// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
import { useCustomers } from "../../queries/customer";

// icons, images & colors
import UserIcon from "../../assets/svg/user.svg";

export default function OrangeryCustomerAutocomplete({
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
  const globalState = useGlobalState();

  const {
    data: customers,
    isLoading,
    isError,
  } = useCustomers(globalState.office_uuid);

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
          options={customers || []}
          renderOption={(props, option) => <li {...props}>{`${option.first_name} ${option.last_name} (${option.email})`}</li>}
          getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
          value={(customers ?? []).find((e: any) => value?.indexOf(e.uuid) !== -1)}
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
        <UserIcon className="icon" />
      </Box>
    </>
  );
}
