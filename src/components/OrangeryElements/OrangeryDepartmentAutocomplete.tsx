// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";

// queries & backend
import {
  useDepartments,
  useUpsertDepartment,
} from "../../queries/department";

// icons, images & colors
import AngleDown from "../../assets/svg/angleBoldDown.svg";
import DepartmentIcon from "../../assets/svg/department.svg";

export default function OrangeryDepartmentAutocomplete({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: React.ReactNode;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const { office_uuid } = useGlobalState();
  const {
    data: departments,
    isLoading,
    isError
  } = useDepartments(office_uuid);

  const mutation = useUpsertDepartment();

  const handleAddNew = async (e: React.MouseEvent) => {
    const newName = inputRef.current?.value;
    if (newName) {
      const result = await mutation.mutateAsync({
        name: newName,
        office_uuid,
      });
      // if (result?.name) {
      //   onChange(result.name);
      // }
    }
  };

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
          options={departments || []}
          popupIcon={<AngleDown className="icon" />}
          renderOption={(props, option) => typeof option.name === "string"
            ? <li {...props} style={{ wordBreak: "break-all" }}>{option.name}</li>
            : option
          }
          getOptionLabel={(option: any) => typeof option.name === "string" ? option.name : ""}
          value={(departments ?? []).find((e: any) => value && typeof e.name === "string" && (value?.indexOf(e.uuid) !== -1))}
          onChange={(_, newValue) => {
            if (typeof newValue?.uuid === "string") {
              onChange(newValue?.uuid);
            }
          }}
          // value={(departments ?? []).find((e: any) => value && typeof e.name === "string" && (value?.indexOf(e.name) !== -1))} ////////!!!!!!!! should be uuid
          // onChange={(_, newValue) => {
          //   if (typeof newValue?.name === "string") { ////////!!!!!!!! should be uuid
          //     onChange(newValue?.name); ////////!!!!!!!! should be uuid
          //   }
          // }}
          noOptionsText={
            <>
              {/* Option Not Found{" "} */}
              <Button
                variant="contained"
                color="secondary"
                onMouseDown={handleAddNew}
                sx={{
                  ml: 2
                }}
              >
                Create Department
              </Button>{" "}
            </>
          }
          isOptionEqualToValue={(option, value) => typeof option.name === "string" ? option.name === value.name : false}
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
                    <DepartmentIcon />
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
