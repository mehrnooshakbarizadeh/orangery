import { Box, Typography } from "@mui/material";
import NoSearchResultIcon from "../../assets/svg/placeholders/noSearchResult.svg";

export default function OrangeryNoSearchResultPlaceholder({
  width,
  height,
  automationSearchResult,
}: {
  width?: string;
  height?: string;
  automationSearchResult?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: automationSearchResult ? "#F9F9FA" : "#fff",
          display: "flex",
          flexDirection: "column",
          height: height ? height : "100%",
          width: "100%",
          // width: width ? width : "100%",
          borderRadius: 1.5,
          py: 3,
          px: 2,
          justifyContent: "center",
          alignItems: "center",
          ".search-svg": {
            mb: 6,
          },
        }}
      >
        <NoSearchResultIcon className="search-svg" />
        <Typography
          sx={{
            color: automationSearchResult ? "#A5AAB4" : "#2B2E33",
            fontSize: automationSearchResult ? 16 : 30,
            fontWeight: 600,
          }}
        >
          No Results Found.
        </Typography>
        <Typography
          sx={{
            color: automationSearchResult ? "#A5AAB4" : "#505357",
            fontSize: automationSearchResult ? 14 : 20,
            fontWeight: 600, marginTop: 2
          }}
        >
          Try adjusting your search to find what you’re looking for.
        </Typography>
      </Box>
    </>
  );
}
