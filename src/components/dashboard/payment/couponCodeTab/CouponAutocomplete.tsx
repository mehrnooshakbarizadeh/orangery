// react & next
import React from "react";

// external dependencies
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";


export interface IDiscountType {
  name: string,
  value: string
}

export const discountType: IDiscountType[] = [
  {
    name: "%",
    value: "percentage",
  },
  {
    name: "€",
    value: "amount",
  },
]

export default function CouponAutocomplete({
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
  helperText?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  
  return (
    <>
      <Box sx={{ width: "100%", height: "85px" }}>
        {discountType ? (
          <Autocomplete
            disableListWrap
            options={discountType}
            
            renderOption={(props, option) => (
              <li {...props}>{option.name}</li>
            )}
            getOptionLabel={(option: any) => option.name}
            value={discountType?.find((d) => d.name === value) || null}
            onChange={(_, newValue: any) => {
              onChange(newValue?.value || "");
            }}
            sx={{
              "& .MuiAutocomplete-input": { ml: 2.5 },
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                error={error}
                helperText={helperText}
                name={name}
                label={label}
                placeholder={placeholder}
                
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
