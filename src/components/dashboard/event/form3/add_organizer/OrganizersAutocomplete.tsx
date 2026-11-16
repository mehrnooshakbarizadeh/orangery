// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

import React from "react";
import UserIcon from "../../../../../assets/svg/user.svg";
import {
  Autocomplete,
  Box,
  Button,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import AngleDown from "../../../../../assets/svg/angleBoldDown.svg";
import AddIcon from "@mui/icons-material/Add";
import { EventFieldsState } from "../../EventForm";
import { IEmployee, useEmployees } from "../../../../../queries/employee";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export default function OrganizersAutocomplete({
  sx,
  label,
  value,
  onChange,
  state,
}: {
  sx?: SxProps<Theme> | undefined;
  label: string;
  value: string[];
  onChange: (value: IEmployee[]) => void;
  state: EventFieldsState | OrganizerEventFieldsState;
}) {
  const globalState = useGlobalState();
  const { data: employees } = useEmployees(globalState.office_uuid);

  const handleAddNew = async (e: React.MouseEvent) => {
    const newName = inputRef.current?.value;
    if (newName) {
      state.setIsAddOrganizer(true);
      state.setOrganizerFirstName(newName);
    }
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          ...sx,
          width: "100%",
          // height: "85px",
          position: "relative",
          "& .MuiChip-root": { ml: 1.5 },
          "& .MuiOutlinedInput-root": {
            pl: 4,
          },
          "& .icon-angleDown": {
            width: "1rem",
            height: "1rem",
            color: "rgba(0, 0, 0, 0.54)",
          },
          "& .icon": {
            mr: 2,
            position: "absolute",
            width: "1.3rem",
            height: "1.3rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(2.2),
            left: (theme) => theme.spacing(2.1),
          },
        }}
      >
        <Autocomplete
          options={employees || []}
          popupIcon={<AngleDown className="icon-angleDown" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(employees ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e));
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          noOptionsText={
            <>
              User not found
              <Button
                sx={{ ml: 1, color: "#fff", backgroundColor: "#000" }}
                variant="contained"
                onMouseDown={handleAddNew}
              >
                <AddIcon />
                Add Manually
              </Button>{" "}
            </>
          }
          sx={{
            "& .MuiAutocomplete-tag": { display: "none" },
            "& .MuiAutocomplete-clearIndicator": { display: "none" },
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              placeholder="Search people and select them"
              {...params}
              inputRef={inputRef}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              // placeholder="Select Features..."
              sx={{
                "& .MuiAutocomplete-endAdornment": { right: "16px !important" },
                "& .MuiAutocomplete-input": { ml: 4 },
              }}
            />
          )}
        />
        <UserIcon className="icon" />
      </Box>
    </>
  );
}
