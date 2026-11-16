// contexts & globals
import AngleDown from "../../assets/svg/angleBoldDown.svg";
import LocationIcon from "../../assets/svg/office-location.svg";
// react & next
import React, { ReactNode } from "react";

// external dependencies
import { Autocomplete, Box, SxProps, TextField, Theme } from "@mui/material";

// queries & backend

// icons, images & colors
import UsersIcon from "../../assets/svg/attendees.svg";
import { useOffices } from "../../queries/office";

export default function OrangeryOfficesAutocomplete({
  sx,
  label,
  values,
  onChange,
}: {
  sx?: SxProps<Theme> | undefined;
  label?: string;
  values: string[];
  onChange: (value: string[]) => void;
}) {
  // const globalState = useGlobalState();
  const { data: offices, isLoading, isError } = useOffices();

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
        <Autocomplete
          options={offices || []}
          popupIcon={<AngleDown className="icon-angleDown" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(offices ?? []).filter((e) => values?.indexOf(e.uuid) !== -1)}
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
              placeholder="Type the name..."
              sx={{
                // "& .MuiAutocomplete-input": { ml: 2 },
                "& .MuiOutlinedInput-root": {
                  pl: 5,
                },
              }}
            />
          )}
        />
        <LocationIcon className="icon" />
      </Box>
    </>
  );
}
