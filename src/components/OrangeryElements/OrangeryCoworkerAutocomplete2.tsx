// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { createFilterOptions } from '@mui/material/Autocomplete';

// orangery elements & internal dependencies
import {
  OrangeryCircleLoading,
  OrangeryTextField,
  OrangeryUserCard5,
} from ".";

// queries & backend
import {
  ICoworker,
  useCoworkers
} from "../../queries/coworker";
import OrangeryUserCard7 from "./OrangeryUserCard7";

export default function OrangeryCoworkerAutocomplete2({
  preUsers = [],
  helperText,
  name,
  placeholder,
  label,
  value,
  onChange,
  error,
  icon,
  disabled,
  labelsWithEmail,
  labelsWithRole,
  withoutVisitors
}: {
  preUsers?: ICoworker[];
  disabled?: boolean;
  icon: React.ReactNode;
  helperText: React.ReactNode;
  name: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  labelsWithEmail?: boolean;
  labelsWithRole?: boolean;
  withoutVisitors?: boolean;
}) {
  // console.log({ value });
  const { office_uuid } = useGlobalState();
  const {
    data: coworkers,
    isLoading,
    isError,
  } = useCoworkers(office_uuid, withoutVisitors);

  const [options, setOptions] = React.useState([...(preUsers ?? []), ...(coworkers ?? [])])
  React.useEffect(() => {
    if (coworkers)
      setOptions([...(preUsers ?? []), ...(coworkers ?? [])])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coworkers])

  const [selectedValue, setSelectedValue] = React.useState<ICoworker | undefined>(options.find((e) => value === e.uuid))
  React.useEffect(() => {
    if (options)
      setSelectedValue(options.find((e) => value === e.uuid))
  }, [options, value])

  // console.log({ options })

  const filterOptions = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: ICoworker) => `${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`,
  });

  const height = 120;

  return (<Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      ...(selectedValue
        ? {
          height: height,
        }
        : {
          height: height,
        }
      )
    }}
  >
    {!isLoading && coworkers // && (value ? selectedValue : true)
      ? <>
        <Box
          sx={{
            "& .MuiOutlinedInput-root": {
              pl: 1,
            },
            "& .icon": {
              mr: 2,
              position: "absolute",
              width: "1.125rem",
              height: "1.125rem",
              color: "grey.A200",
              top: (theme) => theme.spacing(2.3),
              left: (theme) => theme.spacing(1),
            },
          }}
        >
          <Autocomplete
            options={options}
            renderOption={(props, option) => <li {...props} key={option.uuid}>
              <OrangeryUserCard5
                user={option}
                size={32}
                labelsWithRole={labelsWithRole}
                labelsWithEmail={labelsWithEmail}
              />
            </li>} // {`${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`}
            // getOptionLabel={(option) => `${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`}
            getOptionLabel={(option) => ""}
            filterOptions={filterOptions}
            value={selectedValue} // {options.find((e) => value?.indexOf(e.uuid) !== -1)}
            onChange={(_, newValue) => {
              onChange(newValue?.uuid ?? "");
            }}
            isOptionEqualToValue={(option, value) => option.uuid === value?.uuid}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                // onClick={() => onChange("")}
                {...params}
                label={label}
                name={name}
                error={error}
                helperText={helperText}
                placeholder={placeholder}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  shrink: true,
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ width: "1.3rem", gap: 0.5, color: "grey.A200" }}
                    >
                      {icon}
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                  "& .MuiFormHelperText-root": { color: "error.main" },
                }}
              />
            )}
          />
        </Box>
        {selectedValue &&
          <OrangeryUserCard7
            user={selectedValue}
            onDelete={() => {
              onChange("")
            }}
          />
        }
        {/* <UserIcon className="icon" /> */}
      </>
      : <OrangeryTextField
        fullWidth
        label={label}
        name={name}
        error={error}
        helperText={helperText}
        placeholder={"Loading options..."}
        InputLabelProps={{
          shrink: true,
        }}
        startIcon={<OrangeryCircleLoading />}
        // InputProps={{
        //   startAdornment: (
        //     <InputAdornment
        //       position="start"
        //       sx={{ width: "1.3rem", gap: 0.5, color: "grey.A200" }}
        //     >
        //       <OrangeryCircleLoading />
        //     </InputAdornment>
        //   ),
        // }}
        sx={{
          "& .MuiInputAdornment-root": {
            position: "absolute",
            left: (theme) => theme.spacing(2),
          },
          "& .MuiOutlinedInput-input": {
            fontSize: 15,
            fontWeight: 600,
            gap: 1,
            color: "grey.A700",
            pl: "40px !important"
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "grey.A100",
          },
          "& .MuiFormHelperText-root": { color: "error.main" },
        }}
      />
    }
  </Box>
  );
}
