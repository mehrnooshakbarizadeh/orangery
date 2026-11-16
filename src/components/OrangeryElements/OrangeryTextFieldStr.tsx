// external dependencies
import { Box, InputAdornment, TextField, TextFieldProps } from "@mui/material";

export default function OrangeryTextFieldStr({
  placeholder,
  label,
  sx,
  startIcon,
  endIcon,
  InputProps,
  ...props
}: {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholder?: string;
} & TextFieldProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        placeholder={placeholder}
        label={label}
        fullWidth
        sx={{
          ...sx,
          "& .MuiInput-root:before": { borderBottom: 0 },
          "&.MuiTextField-root": {
            // backgroundColor: "#f5f7fa",
          },
          "& .MuiOutlinedInput-input": {
            fontSize: 15,
            fontWeight: 600,
            gap: 1,
            pl: startIcon || InputProps?.startAdornment ? 6 : 2,
            pr: endIcon || InputProps?.endAdornment ? 6 : 2,
            color: "grey.A700",
            borderRadius: 1,
            backgroundColor: "#fff !important",
          },
          "& .MuiOutlinedInput-root": {
            pl: 0,
            pr: 0,
          },
          "& .MuiInputAdornment-root": {
            position: "absolute",
            ...(startIcon || InputProps?.startAdornment
              ? { left: (theme) => theme.spacing(2) }
              : {}),
            ...(endIcon || InputProps?.endAdornment
              ? { right: (theme) => theme.spacing(2) }
              : {}),
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
        InputProps={
          InputProps
            ? InputProps
            : startIcon
            ? {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                      gap: 0.5,
                      color: "#A5AAB4",
                    }}
                  >
                    {startIcon}
                  </InputAdornment>
                ),
              }
            : {}
        }
        {...props}
      />
    </Box>
  );
}
