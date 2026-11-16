// 
import {
  Typography,
} from "@mui/material";

export default function OrangeryTableCell({
  title,
  text,
}: {
  title: any
  text: any
}) {
  return (
    <>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "#9A9CA0"
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 400,
          color: "#2B2E33"
        }}
      >
        {text}
      </Typography>
    </>
  );
};