// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// icons, images & colors
import SortIcon from "../../../../../assets/svg/sort.svg";
import AngleDown from "../../../../../assets/svg/angleBoldDown.svg";

export interface ISort {
  name: string;
  value: string;
}

export const sortItems: ISort[] = [
  {
    name: "Offer name",
    value: "Offer name",
  },
  {
    name: "Name",
    value: "Name",
  },
  {
    name: "Email",
    value: "Email",
  },
  {
    name: "Lock name",
    value: "Lock name",
  },
  {
    name: "Status",
    value: "Status",
  },
];

export default function SortDoorRequestAutocomplete({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  label?: React.ReactNode;
  value: React.ReactNode;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <>
      <Box sx={{ width: "100%", "& .icon": { width: "1rem", height: "1rem" } }}>
        {sortItems ? (
          <Autocomplete
            disableListWrap
            popupIcon={<AngleDown className="icon" />}
            options={sortItems}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
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
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField
                variant="standard"
                sx={{
                  "& .MuiInput-root:before": { borderBottom: "none" },
                  "& .MuiAutocomplete-inputRoot": { height: "55px" },
                  "& .MuiAutocomplete-endAdornment": { right: "16px" },
                  "& .MuiInputAdornment-root": { mr: 2 },
                  "& .MuiInput-input": {
                    fontSize: "17px !important",
                    fontWeight: "400 !important",
                    color: "#505357 !important",
                  },
                  backgroundColor: "#F5F7FA",
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
                        "& .sort-icon": {
                          mr: 2,
                          position: "absolute",
                          width: "1.3rem",
                          height: "1.3rem",
                          color: "#505357",
                          top: (theme) => theme.spacing(-1.3),
                          left: (theme) => theme.spacing(1),
                        },
                      }}
                    >
                      <SortIcon className="sort-icon" />
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
