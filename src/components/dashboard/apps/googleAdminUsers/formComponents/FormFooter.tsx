import { Box, Typography } from "@mui/material";

export function FormFooter({
  paragraph,
  buttonLeft,
  buttonRight,
  syncLoading,
}: {
  paragraph?: any;
  buttonLeft?: any;
  buttonRight?: any;
  syncLoading?: any;
}) {
  return (
    <>
      {syncLoading}
      <Typography variant="h5">{paragraph}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {buttonLeft}
        {buttonRight}
      </Box>
    </>
  );
}
