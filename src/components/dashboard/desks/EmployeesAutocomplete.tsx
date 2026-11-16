// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField } from "@mui/material";

// queries & backend
import { useEmployees } from "../../../queries/employee";

// icons, images & colors
import UserIcon from "../../../assets/svg/user.svg";

export default function EmployeesAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
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
          width: "100%",
          mb: 4,
          // height: "85px",
          position: "relative",
          "& .icon": {
            mr: 2,
            position: "absolute",
            width: "1.125rem",
            height: "1.125rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(2.3),
            left: (theme) => theme.spacing(2),
          },
        }}
      >
        <Autocomplete
          options={employees || []}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(employees ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e.uuid));
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              placeholder="Assign To..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  pl: 5
                },
              }}
            />
          )}
        />
        <UserIcon className="icon" />
      </Box>
    </>
  );
}
