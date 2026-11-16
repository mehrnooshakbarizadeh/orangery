// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";

// queries & backend
import { useGroups } from "../../../queries/group";

// icons, images & colors
import UserTieIcon from "../../../assets/svg/user-tie.svg";

export default function RoleAutocomplete({
  label,
  name,
  value,
  placeholder,
  error,
  helperText,
  onChange,
}: {
  error: boolean;
  name: string;
  label: React.ReactNode;
  value: React.ReactNode;
  placeholder?: string;
  helperText: React.ReactNode;
  onChange: (value: string) => void;
}) {
  const globalState = useGlobalState();
  const { data: groups, isLoading, isError } = useGroups();
  const user = globalState.currentUser;

  // const mutation = useUpsertGroup();

  return (
    <>
      <Box sx={{ width: "100%", height: "85px" }}>
        {groups ? (
          <Autocomplete
            disableListWrap
            options={groups}
            getOptionDisabled={(option) =>
              user?.group.name !== "owner" ? option.name === "owner" : false
            }
            renderOption={(props, option) => (
              <li {...props}>{option.display_name}</li>
            )}
            getOptionLabel={(option: any) => option.display_name}
            value={groups?.find((d) => d.uuid === value) || null}
            onChange={(_, newValue: any) => {
              onChange(newValue?.uuid || "");
            }}
            sx={{
              "& .MuiAutocomplete-input": {
                ml: 2.5,
                color: '#374C6B !important', fontSize: '15px !important', fontWeight: "600 !important"
              },
            }}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
            renderInput={(params) => (
              <TextField
                {...params}
                error={error}
                helperText={helperText}
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
                      <UserTieIcon className="user-tie-icon" />
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
