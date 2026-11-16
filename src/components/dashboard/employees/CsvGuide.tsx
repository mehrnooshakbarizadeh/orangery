import { Box, Typography } from "@mui/material";
import DownloadCsvSample from "./DownloadCsvSample";

export default function CsvGuide() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: "40px",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontSize={16} fontWeight={400} color="#000">
            You can download sample file to fill it with your employees
            information, and then upload it here.
          </Typography>
        </Box>
        <DownloadCsvSample />
      </Box>
      <Box
        sx={{
          m: "37px auto",
          borderTop: "1px solid #EDEEF0",
        }}
      />
    </>
  );
}
