// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import AngleDown from "../../assets/svg/angleBoldDown.svg";
// react & next
import React from "react";

// external dependencies
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

// queries & backend
import { useFloors, useUpsertFloor } from "../../queries/floor";

// icons, images & colors
import Layer from "../../assets/svg/layer.svg";

export default function OrangeryFloorAutocomplete({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const globalState = useGlobalState();
  const {
    data: floors,
    isLoading,
    isError,
  } = useFloors(globalState.office_uuid);

  const { office_uuid } = useGlobalState();
  const mutation = useUpsertFloor();

  const handleAddNew = async (e: React.MouseEvent) => {
    const newName = inputRef.current?.value;
    if (newName) {
      const result = await mutation.mutateAsync({ name: newName, office_uuid });
      const uuid = result?.uuid || "";
      if (result?.uuid) {
        onChange(result?.uuid);
      }
    }
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "85px",
          "& .icon": { width: "1rem", height: "1rem" },
        }}
      >
        <Autocomplete
          // sx={{ width: 170 }}
          disableListWrap
          options={floors || []}
          popupIcon={<AngleDown className="icon" />}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          getOptionLabel={(option) => option.name}
          value={floors?.find((f) => f.uuid === value) || null}
          onChange={(_, newValue) => {
            onChange(newValue?.uuid || "");
          }}
          noOptionsText={
            <>
              {/* Option Not Found{" "} */}
              <Button
                variant="contained"
                color="secondary"
                onMouseDown={handleAddNew}
              >
                Create Floor
              </Button>{" "}
            </>
          }
          isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
          renderInput={(params) => (
            <TextField
              label={label}
              {...params}
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
              inputRef={inputRef}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#A5AAB4",
                      gap: 0.5,
                    }}
                  >
                    <Layer />
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
