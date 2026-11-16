import { Box, IconButton, Typography } from "@mui/material";
import PlusIcon from "../../../assets/svg/plus.svg";
import RemoveIcon from "@mui/icons-material/Remove";

export default function AttendeeCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const handleDec = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };
  const handleInc = () => {
    onChange(value + 1);
  };
  return (
    <>
      <Box
        sx={{
          mb: 2,
          width: "30%",
          backgroundColor: "#F9F9FA",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          height: "55px",
          "& .plus-icon": {
            width: "0.8rem",
            height: "0.8rem",
            color: "#000",
          },
        }}
      >
        <Typography fontSize="13px" fontWeight={600} whiteSpace="nowrap">
          Number of Attendees
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleDec}>
            <RemoveIcon className="plus-icon" />
          </IconButton>
          <Typography fontSize="14px" fontWeight={700}>
            {value}
          </Typography>
          <IconButton onClick={handleInc}>
            <PlusIcon className="plus-icon" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
