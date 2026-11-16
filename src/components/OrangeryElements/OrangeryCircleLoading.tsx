// external dependencies
import { Box, CircularProgress } from "@mui/material";

export default function OrangeryCircleLoading() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={24} color="inherit" />
    </Box>
  );
}
