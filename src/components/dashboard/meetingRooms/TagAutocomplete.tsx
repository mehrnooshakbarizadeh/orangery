// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import AngleDown from "../../../assets/svg/angleBoldDown.svg";
import ListCheckedIcon from "../../../assets/svg/list-checked.svg";
// external dependencies
import {
  Autocomplete,
  Box,
  Button,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

// queries & backend
import { useEmployees } from "../../../queries/employee";

// icons, images & colors
import TagIcon from "../../../assets/svg/tag.svg";
import { useTags, useUpsertTag } from "../../../queries/tag";

export default function TagAutocomplete({
  sx,
  label,
  value,
  onChange,
}: {
  sx?: SxProps<Theme> | undefined;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const globalState = useGlobalState();
  const { data: tags, isLoading, isError } = useTags(globalState.office_uuid);

  const { office_uuid } = useGlobalState();
  const mutation = useUpsertTag();

  const handleAddNew = async (e: React.MouseEvent) => {
    const newName = inputRef.current?.value;
    if (newName) {
      const result = await mutation.mutateAsync({ name: newName, office_uuid });
      const uuid = result?.uuid || "";
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
          options={tags || []}
          popupIcon={<AngleDown className="icon-angleDown" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          multiple
          value={(tags ?? []).filter((e) => value?.indexOf(e.uuid) !== -1)}
          onChange={(_, newValues) => {
            onChange(newValues.map((e) => e.uuid));
          }}
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          noOptionsText={
            <>
              {/* Option Not Found{" "} */}
              <Button
                variant="contained"
                color="secondary"
                onMouseDown={handleAddNew}
              >
                Add Features
              </Button>{" "}
            </>
          }
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
              inputRef={inputRef}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: true,
              }}
              placeholder="Select Features..."
              sx={{
                "& .MuiAutocomplete-endAdornment": { right: "16px !important" },
                "& .MuiAutocomplete-input": { ml: 2 },
              }}
            />
          )}
        />
        <ListCheckedIcon className="icon" />
      </Box>
    </>
  );
}
