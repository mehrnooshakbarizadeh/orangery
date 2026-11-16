// react & next
import {
  Autocomplete,
  Box,
  MenuItem,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import React from "react";

export interface IProductType {
  name: string;
  value: string;
}

export const productType: IProductType[] = [
  {
    name: "Private Office",
    value: "private_office",
  },
  {
    name: "Hybrid Office",
    value: "hybrid_office",
  },
  {
    name: "Cubes",
    value: "cube",
  },
  {
    name: "Flex (dayPass/monthly)",
    value: "flex",
  },
  {
    name: "Mobility",
    value: "mobility",
  },
  {
    name: "Assets",
    value: "asset",
  },
  {
    name: "Coliving",
    value: "coliving",
  },
  {
    name: "Food",
    value: "food",
  },
];

export default function ProductType({
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
          <Box sx={{ width: "100%", height: "85px" }}>
            <TextField
              select
              placeholder={placeholder}
              {...props}
              label={label}
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
                // "& .MuiInputLabel-root": {
                //   top: (theme) => theme.spacing(-3),
                //   fontSize: `11px`,
                //   fontWeight: "bold",
                //   transform: "unset",
                // },
                "& .MuiOutlinedInput-notchedOutline > legend > span": {
                  display: label ? "block" : "none",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {productType.map((type) => (
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
