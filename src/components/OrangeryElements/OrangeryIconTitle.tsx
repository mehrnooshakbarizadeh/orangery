// contexts & globals
import { useTranslation } from "react-i18next";
import { languages } from "../../../i18n";

// external dependencies
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, Button, Typography } from "@mui/material";

export default function OrangeryIconTitle({ title, icon, sx, small }: { title: string, icon?: ReactJSXElement, sx?: any, small?: any }) {
  return (<Box
    sx={{
      ...sx,
      display: "flex",
    }}
  >
    {icon &&
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "primary",
          height: "100%",
          pt: .4,
          marginRight: 1.5,
        }}
      >
        {icon}
      </Box>
    }
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "primary",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: small ? 22 : 28,
          fontWeight: 700,
          color: "primary",
        }}
      >
        {title}
      </Typography>
    </Box>
  </Box>
  );
}
