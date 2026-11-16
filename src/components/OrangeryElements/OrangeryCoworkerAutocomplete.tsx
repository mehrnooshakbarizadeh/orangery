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
  OrangeryUserCard6
} from ".";

// queries & backend
import {
  ICoworker,
  useCoworkers
} from "../../queries/coworker";

export default function OrangeryCoworkerAutocomplete({
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
  withoutVisitors,
  noHeight,
}: {
  preUsers?: ICoworker[];
  disabled?: boolean;
  icon?: React.ReactNode;
  helperText?: React.ReactNode;
  name: string;
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  labelsWithEmail?: boolean;
  labelsWithRole?: boolean;
  withoutVisitors?: boolean;
  noHeight?: boolean
}) {
  const { office_uuid } = useGlobalState();
  const {
    data: coworkers,
    isLoading,
    isError,
  } = useCoworkers(office_uuid, withoutVisitors);

  const [options, setOptions] = React.useState([...(preUsers ?? []), ...(coworkers ?? [])])
  React.useEffect(() => {
    setOptions([...(preUsers ?? []), ...(coworkers ?? [])])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coworkers])

  const [selectedValue, setSelectedValue] = React.useState<ICoworker | undefined>(options.find((e) => value === e.uuid))
  React.useEffect(() => {
    setSelectedValue(options.find((e) => value === e.uuid))
  }, [options, value])

  const filterOptions = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: ICoworker) => `${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`,
  });

  return (!isLoading && coworkers // && (value ? selectedValue : true)
    ? <Box
      sx={{
        width: "100%",
        ...(noHeight
          ? {}
          : { height: "85px" }
        ),
        position: "relative",
        "& .MuiOutlinedInput-root": {
          pl: icon ? 4 : 0,
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
            // placeholder={selectedValue ? "" : placeholder}
            placeholder={selectedValue ? "" : placeholder}
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
              "& .MuiAutocomplete-input": { pl: icon ? "40px !important" : "20px !important" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#C9CCD2",
              },
              "& .MuiFormHelperText-root": { color: "error.main" },
            }}
          />
        )}
      />
      {selectedValue &&
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: icon ? 50 : 16,
            maxWidth: "65%"
          }}
        >
          <OrangeryUserCard6
            user={selectedValue}
            size={32}
            labelsWithRole={labelsWithRole}
            labelsWithEmail={labelsWithEmail}
          />
        </Box>
      }
      {/* <UserIcon className="icon" /> */}
    </Box>
    : <OrangeryTextField
      noHeight={noHeight}
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
          borderColor: "#C9CCD2",
        },
        "& .MuiFormHelperText-root": { color: "error.main" },
      }}
    />
  );
}
