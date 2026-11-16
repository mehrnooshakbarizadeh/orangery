// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import AngleDown from "../../assets/svg/angleBoldDown.svg";
// react & next
import React, { ReactNode } from "react";

// external dependencies
import { Autocomplete, Box, SxProps, TextField, Theme } from "@mui/material";

// queries & backend
import { useEmployees } from "../../queries/employee";
import {
  ICoworker,
  useCoworkers
} from "../../queries/coworker";
// icons, images & colors
import UsersIcon from "../../assets/svg/attendees.svg";

export default function OrangeryEmployeesAutocomplete({
  sx,
  label,
  value,
  withoutVisitors,
  withCoworker,
  onChange,
}: {
  sx?: SxProps<Theme> | undefined;
  label: string;
  value: string[];
  withoutVisitors?: boolean;
  withCoworker?: boolean;
  onChange: (value: string[]) => void;
}) {
  const globalState = useGlobalState();
  const { office_uuid } = useGlobalState();
  const {
    data: employees,
    isLoading,
    isError,
  } = useEmployees(globalState.office_uuid);

  const {
    data: coworkers,
  } = useCoworkers(office_uuid, withoutVisitors);

  return (
    <>
      <Box
        sx={{
          ...sx,
          width: "100%",
          position: "relative",
          "& .icon-angleDown": {
            width: "1rem",
            height: "1rem",
            color: "rgba(0, 0, 0, 0.54)",
            mr: 1,
          },
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
        {withCoworker ? (<Autocomplete
          options={coworkers || []}
          popupIcon={<AngleDown className="icon-angleDown" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(coworkers ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
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
                // "& .MuiAutocomplete-input": { ml: 2 },
                "& .MuiOutlinedInput-root": {
                  pl: 5,
                },
              }}
            />
          )}
        />)
          :
          (<Autocomplete
            options={employees || []}
            popupIcon={<AngleDown className="icon-angleDown" />}
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
                  // "& .MuiAutocomplete-input": { ml: 2 },
                  "& .MuiOutlinedInput-root": {
                    pl: 5,
                  },
                }}
              />
            )}
          />)}

        <UsersIcon className="icon" />
      </Box>
    </>
  );
}
