// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, TextField, Chip } from "@mui/material";
import OrangeryUserCircle from "./OrangeryUserCircle";
// queries & backend
import { useEmployees, IEmployee } from "../../queries/employee";

// icons, images & colors
import UserIcon from "../../assets/svg/user.svg";

export default function OrangeryEmployeesAvatarAutocomplete({
  label,
  value,
  editMode,
  viewMode,
  onChange,
  sx,
}: {
  label?: string;
  value?: string[];
  editMode?: boolean;
  viewMode?: boolean;
  onChange: (value: string[]) => void;
  sx?: any;
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
          height: "100%",
          position: "relative",
          "& .MuiOutlinedInput-root": {
            pl: 4,
          },
          "& .icon": {
            ml: 2,
            mr: 4,
            position: "absolute",
            width: "1.125rem",
            height: "1.125rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(3),
            left: (theme) => theme.spacing(0.4),
          },
        }}
      >
        <Autocomplete
          readOnly={viewMode}
          forcePopupIcon={!viewMode}
          sx={
            viewMode
              ? {
                  ml: -2,
                  "&.MuiAutocomplete-root-disabled fieldset": { opacity: 1 },
                  "&.MuiAutocomplete-root fieldset": {
                    border: "1px solid transparent !important",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent !important",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "primary.main",
                    lineHeight: 1.5,
                  },
                }
              : {}
          }
          // disabled={editMode}
          options={employees || []}
          renderOption={(props, option) => (
            <li {...props}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <OrangeryUserCircle
                  name={option.name}
                  fileName={option.image}
                  size={34}
                  sx={{ mr: 1 }}
                />
                {option.name}
              </Box>
            </li>
          )}
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
              placeholder={viewMode ? "" : "Assign to..."}
              sx={{
                border: "1px solid transparent",
                "& .MuiAutocomplete-input": {
                  ml: 2,
                  border: "1px solid transparent",
                },
                // "&.MuiTextField-root": { backgroundColor: "#f5f7fa" },
              }}
            />
          )}
          renderTags={(value: readonly IEmployee[], getTagProps) =>
            value.map((option: IEmployee, index: number) => (
              <Chip
                size="medium"
                {...getTagProps({ index })}
                variant="outlined"
                label={option.name}
                key={option.uuid}
                avatar={
                  <OrangeryUserCircle
                    name={option.name}
                    fileName={option.image}
                    size={34}
                    sx={{ mr: 0.2, ml: 0.2 }}
                  />
                }
                sx={{
                  height: 50,
                  fontSize: 14,
                  backgroundColor: "#F9F9FA",
                  borderRadius: "5px",
                  border: "1px solid transparent",
                }}
              />
            ))
          }
        />
        {/* <UserIcon className="icon" sx={{ mr: 3 }} /> */}
      </Box>
    </>
  );
}
