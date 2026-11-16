// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, Button, TextField } from "@mui/material";

// queries & backend
import { useEmployees } from "../../../queries/employee";

// icons, images & colors
import TagIcon from "../../../assets/svg/tag.svg";
import { useTags, useUpsertTag } from "../../../queries/tag";

export default function TagAutocomplete({
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
    data: tags,
    isLoading,
    isError,
  } = useTags(globalState.office_uuid);

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
          width: "100%",
          height: "85px",
          position: "relative",
          "& .MuiChip-root": { ml: 1.5 },
          "& .MuiOutlinedInput-root": {
            pl: 4,
          },
          "& .icon": {
            mr: 2,
            position: "absolute",
            width: "1.125rem",
            height: "1.125rem",
            color: "grey.A200",
            top: (theme) => theme.spacing(2.2),
            left: (theme) => theme.spacing(2.8),
          },
        }}
      >
        <Autocomplete
          options={tags || []}
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
              placeholder="Add features..."
              sx={{
                "& .MuiAutocomplete-input": { ml: 2 },
              }}
            />
          )}
        />
        <TagIcon className="icon" />
      </Box>
    </>
  );
}
