// external dependencies
import { Box, Switch, SwitchProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomizedSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 48,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.tertiary.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#D2D3D6",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function OrangerySwitch({
  title,
  label,
  sx,
  checked,
  checkedLabels,
  variant,
  backgroundColor,
  textOnRight = false,
  ...props
}: {
  label?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  title?: React.ReactNode;
  checkedLabels?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  variant?: string;
  backgroundColor?: string;
  textOnRight?: boolean;
} & SwitchProps) {
  let customizedSwitchSx = {} as any;
  if (variant === "large")
    customizedSwitchSx = {
      "& .MuiSwitch-root": {
        height: 47,
        width: 77,
        borderRadius: 9999
      },
      "& .MuiSwitch-switchBase": {
        margin: "3px"
      },
      "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
        backgroundColor: "#34C759 !important",
      },
      "& .MuiSwitch-thumb": {
        height: 41,
        width: 41,
      },
      "& .Mui-checked": {
        transform: "translateX(30px) !important",
      }
    }

  return (
    <>
      {" "}
      <Box
        sx={{
          ...sx,
          ...customizedSwitchSx,
          display: "flex",
          alignItems: "center",
          borderRadius: 1.5,
          fontWeight: 400,
          justifyContent: "end",
          height: 55,
          width: "100%",
          backgroundColor: backgroundColor ?? "#fff",
          px: 2,
        }}
      >
        {!textOnRight &&
          <Box sx={{ flexGrow: 1, }}>
            {label && (
              <Typography
                fontWeight={400}
                sx={{
                  color: checked ? "#2B2E33" : "#A5AAB4",
                  fontSize: "16",
                  transition: "0.5s",
                }}
              >
                {checked && label.checked}
                {!checked && label.unchecked}
              </Typography>
            )}
          </Box>}

        <CustomizedSwitch
          {...props}
          checked={checked}
          {...props}
          sx={customizedSwitchSx}
          color="primary"
        />

        {textOnRight && <Box sx={{ flexGrow: 1, ml: 1.5 }}>
          {label && (
            <Typography
              fontWeight={400}
              sx={{
                color: "#2B2E33",
                fontSize: "16",
                transition: "0.5s",
              }}
            >
              {checked && label.checked}
              {!checked && label.unchecked}
            </Typography>
          )}
        </Box>}
      </Box>
    </>
  );
}
