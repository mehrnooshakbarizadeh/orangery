// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import AngleDown from "../../../assets/svg/angleBoldDown.svg";
// react & next
import React from "react";
import UserIcon from "../../../assets/svg/user.svg";

// external dependencies
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";

// queries & backend
//

// icons, images & colors
import { useEmployees } from "../../../queries/employee";

export default function OrganizerAutocomplete({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const { office_uuid } = useGlobalState();
  const { data: employees, isLoading, isError } = useEmployees(office_uuid);

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "85px",
          "& .icon": {
            width: "1rem",
            height: "1rem",
            color: "rgba(0, 0, 0, 0.54)",
          },
        }}
      >
        <Autocomplete
          // sx={{ width: 170 }}
          disableListWrap
          options={employees || []}
          popupIcon={<AngleDown className="icon" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          value={employees?.find((d) => d.uuid === value) || null}
          onChange={(_, newValue) => {
            onChange(newValue?.uuid || "");
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
              placeholder={placeholder}
              inputRef={inputRef}
              sx={{
                "& .MuiAutocomplete-endAdornment": { right: "16px !important" },
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
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      width: "1.2rem",
                      height: "1.2rem",
                      gap: 0.5,
                      color: "#A5AAB4",
                    }}
                  >
                    <UserIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>
    </>
  );
}
