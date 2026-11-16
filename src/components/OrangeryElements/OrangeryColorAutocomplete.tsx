// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { createFilterOptions } from '@mui/material/Autocomplete';

// orangery elements & internal dependencies
import {
  OrangeryColorCard,
} from ".";

// queries & backend
//

export default function OrangeryColorAutocomplete({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [options,] = React.useState([
    {
      name: "Yellow",
      code: "#F9D507"
    },
    {
      name: "Dark Grey",
      code: "#2B2E33"
    },
    {
      name: "Green",
      code: "#42B863"
    },
    {
      name: "Orange",
      code: "#FF9900"
    },
  ])

  const [selectedValue, setSelectedValue] = React.useState<any | undefined>(options.find((option) => value?.indexOf(option.code) !== -1))
  React.useEffect(() => {
    setSelectedValue(options.find((option) => value?.indexOf(option.code) !== -1))
  }, [options, value])

  const filterOptions = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option: any) => `${option.name}`,
  });

  return <Box
    sx={{
      width: "100%",
      height: "85px",
      position: "relative",
      "& .MuiOutlinedInput-root": {
        pl: 4,
      },
    }}
  >
    <Autocomplete
      options={options}
      renderOption={(props, option) => <li {...props} key={option.code}>
        <OrangeryColorCard
          color={option}
          size={28}
        />
      </li>} // {`${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`}
      // getOptionLabel={(option) => `${option.name}${labelsWithEmail ? ` (${option.email})` : ""}`}
      getOptionLabel={(option) => ""}
      filterOptions={filterOptions}
      value={selectedValue} // {options.find((e) => value?.indexOf(e.code) !== -1)}
      onChange={(_, newValue) => {
        onChange(newValue?.code ?? "");
      }}
      isOptionEqualToValue={(option, value) => option.code === value?.code}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          // placeholder={selectedValue ? "" : placeholder}
          placeholder={selectedValue ? "" : placeholder}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
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
            "& .MuiAutocomplete-input": { pl: "5  px !important" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "grey.A100",
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
          top: 16,
          left: 16,
          maxWidth: "65%"
        }}
      >
        {selectedValue?.name}
      </Box>
    }
  </Box>
}
