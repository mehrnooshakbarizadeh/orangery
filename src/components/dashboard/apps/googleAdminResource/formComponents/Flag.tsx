import { Box, Typography } from "@mui/material";

export function Flag({ willAdd }: { willAdd?: boolean }) {
  return willAdd ? (
    <Box
      sx={{
        borderRadius: "60px",
        width: 74,
        height: 21,
        backgroundColor: "#EDEEF0",
        fontSize: 10,
        fontWeight: 600,
        color: "#55585C",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Will be added
    </Box>
  ) : (
    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#A5AAB4" }}>
      Already exists
    </Typography>
  );
}
