// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";

// queries & backend
import { IGroup, useGroups } from "../../../queries/group";
import { useUser } from "../../../queries/dashboard";

// icons, images & colors
import SortIcon from "../../../assets/svg/sort.svg";

export interface ISort {
  name: string,
  value: string
}

export const sortItems: ISort[] = [
  {
    name: 'Floor',
    value: 'Floor',
  },
  {
    name: "Department",
    value: "Department",
  },
  {
    name: "Customer",
    value: "Customer",
  },
]


export default function SortRoomsAutocomplete({
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  name: string;
  label?: React.ReactNode;
  value: React.ReactNode;
  onChange: (value: string) => void;
  placeholder?: string;
}) {

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {sortItems ? (
          <Autocomplete
            disableListWrap
            options={sortItems}
            renderOption={(props, option) => (
              <li {...props}>{option.name}</li>
            )}
            getOptionLabel={(option: ISort) => option.name}
            value={sortItems?.find((d) => d.name === value) || null}
            onChange={(_, newValue: any) => {
              onChange(newValue?.value || "");
            }}
            sx={{
              "& .MuiAutocomplete-input": { ml: 2.5 },
              "& .MuiInput-root:hover": { borderBottom: "none" },
              "& .MuiTextField-root": { borderRadius: 1.2 },
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField
                variant="standard"
                sx={{
                  "& .MuiInput-root:before": { borderBottom: 'none' },
                  "& .MuiAutocomplete-inputRoot": { height: '55px' },
                  backgroundColor: '#F5F7FA',
                }}
                {...params}
                name={name}
                label={label}
                placeholder={placeholder}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        position: "relative",
                        "& .MuiOutlinedInput-root": {
                          pl: 4,
                        },
                        "& .user-tie-icon": {
                          mr: 2,
                          position: "absolute",
                          width: "1.3rem",
                          height: "1.3rem",
                          color: "grey.A200",
                          top: (theme) => theme.spacing(-1.3),
                          left: (theme) => theme.spacing(1),
                        },
                      }}
                    >
                      <SortIcon className="user-tie-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
