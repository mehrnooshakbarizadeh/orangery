import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Box, Switch, SwitchProps, Typography } from "@mui/material";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
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
    backgroundColor: theme.palette.tertiary.main,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function CustomizedSwitches({
  titleOne,
  subTitleOne,
  titleTwo,
  subTitleTwo,
  checked,
  ...props
}: {
  titleOne?: string;
  subTitleOne?: string;
  titleTwo?: string;
  subTitleTwo?: string;
} & SwitchProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ display: "flex", flexShrink: 0, flexDirection: 'column' }}>
        <Typography
          sx={{ color: !checked ? "tertiary.main" : "grey.A200", fontSize: '17px', fontWeight: 600 }}
        >
          {titleTwo}
        </Typography>
        <Typography
          sx={{
            color: !checked ? "tertiary.main" : "grey.A200",
            fontSize: 11,
            fontWeight: 400,
          }}
        >
          {subTitleTwo}
        </Typography>
      </Box>

      <IOSSwitch checked={checked} {...props} />
      <Box sx={{ display: "flex", flexShrink: 0, flexDirection: 'column' }}>
        <Typography
          sx={{ color: checked ? "tertiary.main" : "grey.A200",fontSize: '17px', fontWeight: 600 }}
        >
          {titleOne}
        </Typography>
        <Typography
          sx={{
            color: checked ? "tertiary.main" : "grey.A200",
            fontSize: 11,
            fontWeight: 400,
          }}
        >
          {subTitleOne}
        </Typography>
      </Box>
    </Stack>
  );
}
