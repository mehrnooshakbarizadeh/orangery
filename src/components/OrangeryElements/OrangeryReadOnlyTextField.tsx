// external dependencies
import { Box, BoxProps, Typography } from "@mui/material";

export default function OrangeryReadOnlyTextField({
  label,
  sx,
  icon,
  value,
}: {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  value: React.ReactNode;
} & BoxProps) {
  return (
    <Box sx={{ ...sx }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "grey.A700" }}>
        {label}
      </Typography>
      <Box
        sx={{
          // ...sx,
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: 265,
          height: 55,
          backgroundColor: "#FAFBFC",
          borderRadius: 1.5,
          mb: 1,
          p: 1,
        }}
      >
        <Box sx={{ width: 15, gap: 0.5, display: "flex", color: "grey.A700" }}>
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: "#8794A6",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
