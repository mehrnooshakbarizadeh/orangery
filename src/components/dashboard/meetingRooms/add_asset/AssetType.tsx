import {
  Autocomplete,
  Box,
  MenuItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import React from "react";

export interface IAssetGroup {
  name: string;
  value: string;
}

export const assetType: IAssetGroup[] = [
  {
    name: "Included",
    value: "Included",
  },
  {
    name: "Optional",
    value: "Optional",
  },
];

export default function AssetType({
  placeholder,
  label,
  sx,
  icon,
  ...props
}: { icon?: React.ReactNode; placeholder?: string } & TextFieldProps) {
  return (
    <>
      <Observer>
        {() => (
          <Box sx={{ width: "100%" }}>
            <TextField
              select
              placeholder={placeholder}
              {...props}
              label={label}
              value={props.value}
              fullWidth
              sx={{
                ...sx,
                "&.MuiTextField-root": {
                  // backgroundColor: "#f5f7fa",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: 15,
                  fontWeight: 600,
                  gap: 1,
                  pl: icon ? 6 : 2,
                  color: "grey.A700",
                  borderRadius: 1,
                  backgroundColor: "#fff !important",
                },
                "& .MuiOutlinedInput-root": {
                  pl: 0,
                },
                "& .MuiInputAdornment-root": {
                  position: "absolute",
                  left: (theme) => theme.spacing(2),
                },
                "& .MuiOutlinedInput-notchedOutline > legend > span": {
                  display: label ? "block" : "none",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {assetType.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </Observer>
    </>
  );
}
