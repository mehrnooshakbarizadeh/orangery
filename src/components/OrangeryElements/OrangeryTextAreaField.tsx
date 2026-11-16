// external dependencies
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

//endIcon related conditions used for NotificationEmailForm component
export default function OrangeryTextAreaField({
  placeholder,
  label,
  sx,
  icon,
  endIcon,
  editMode,
  editorHeight,
  ...props
}: {
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  editMode?: boolean;
  placeholder?: string;
  editorHeight?: string;
} & TextFieldProps) {
  return (
    <TextField
      variant={endIcon ? "filled" : "outlined"}
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
          overflow: "auto !important",
          color: "grey.A700",
          height: editorHeight
            ? `${editorHeight} !important`
            : "75px !important",
        },
        "& .MuiOutlinedInput-root": {
          pl: 0,
          // height: "150px !important",
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

        // "& .MuiFilledInput-input": {
        //   border: "1px solid orange",
        //   borderRadius: 1,

        // },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={
        icon || endIcon
          ? {
              // disableUnderline: endIcon ? true : false,
              style: {
                padding: "10px 30px 10px 10px",
              },
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    display: endIcon ? "none" : "inherit",
                    width: "1.3rem",
                    gap: 0.5,
                    color: "grey.A200",
                    "& .MuiInputAdornment-root": {
                      position: "absolute",
                      left: (theme) => theme.spacing(2),
                    },
                  }}
                >
                  {icon}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    width: "1.3rem",
                    gap: 0.5,
                    color: "grey.A200",
                    position: "absolute",
                    paddingTop: editMode ? 2.5 : 0,
                    top: 15,
                    right: 33,
                  }}
                >
                  {endIcon}
                </InputAdornment>
              ),
            }
          : {}
      }
    />
  );
}
