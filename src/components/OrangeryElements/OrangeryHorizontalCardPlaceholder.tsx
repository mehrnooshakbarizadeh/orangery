// external dependencies
import { Box, Typography } from "@mui/material";

export default function OrangeryHorizontalCardPlaceholder({
  title,
  subtitle,
  right,
}: any) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        "& > * + *": {
          ml: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "none",
          flexBasis: "70%",
          "& > * + *": {
            mt: 1,
          },
        }}
      >
        <Typography sx={{ color: "black", fontSize: 32, fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "black", fontSize: 26, fontWeight: 400 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: "none",
          height: "fit-content",
          my: "auto",
          ml: "auto",
          flexShrink: 0,
          justifySelf: "end",
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
