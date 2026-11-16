import { Typography } from "@mui/material";

export default function LatestTag() {
  return (
    <>
      <Typography
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "45px",
          fontSize: 13,
          fontWeight: 700,
          px: "6px",
          py: "1px",
        }}
      >
        Latest
      </Typography>
    </>
  );
}
