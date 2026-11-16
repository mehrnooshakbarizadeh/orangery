import { Box } from "@mui/material";
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";

export default function ArrowRight() {
  return (
    <Box
      sx={{
        height: "21px",
        "& .arrow-icon": { width: "1rem", height: "1rem" },
      }}
    >
      <ArrowRightIcon className="arrow-icon" />
    </Box>
  );
}
