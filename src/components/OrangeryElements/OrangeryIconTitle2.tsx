// contexts & globals
import { useTranslation } from "react-i18next";
import { languages } from "../../../i18n";

// external dependencies
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, Button, Typography } from "@mui/material";

export default function OrangeryIconTitle2({
  title,
  icon,
  sx,
  small
}: {
  title: string,
  icon?: ReactJSXElement,
  sx?: any,
  small?: any
}) {
  return (<Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: "#55585C",
      gap: 1.5
    }}
  >
    {icon &&
      <Box
        sx={{
          height: 16
        }}
      >
        {icon}
      </Box>
    }
    <Typography
      sx={{
        fontSize: 18,
        fontWeight: 400,
      }}
    >
      {title}
    </Typography>
  </Box >
  );
}
