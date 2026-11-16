// external dependencies
import { Box } from "@mui/material";

export default function OrangeryHorizontalCard({ title, rightButton, children }: any) {
  return (<Box sx={{
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "1px 1px 3px #eaeaea",
    padding: 4
  }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title}
      {rightButton}
    </Box>
    <Box
      sx={{
        mt: 2
      }}>
      {children}
    </Box>
  </Box>
  );
}
