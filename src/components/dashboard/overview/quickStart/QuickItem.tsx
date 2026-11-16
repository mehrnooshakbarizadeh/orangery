import {
  Box,
  Icon,
  IconButton,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import MinusIcon from "../../../../assets/svg/minus.svg";
import PlusIcon from "../../../../assets/svg/plus.svg";

export function QuickItem({
  icon,
  name,
  value,
  onChange,
  sx,
}: {
  sx?: SxProps<Theme> | undefined;
  icon: React.ReactNode;
  name: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const handleIncrease = () => {
    onChange(value + 1);
  };

  const handleDecrease = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <>
      <Box
        sx={{
          ...sx,
          width: "202px",
          flexGrow: 1,
          // backgroundColor: sx ? sx : "#FFFFFF",
          borderRadius: "6.5px",
          p: 1,
          pl: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            "& .icon-btn": {
              width: "1.5rem",
              height: "2rem",
              color: "#000",
            },
            "& .icon": { width: "0.75rem", height: "0.75rem", color: "#000" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: "8px",
            }}
          >
            <Icon className="icon-btn">{icon}</Icon>
            <Typography
              fontSize={11}
              fontWeight={600}
              sx={{ whiteSpace: "nowrap" }}
            >
              {name}
            </Typography>
          </Box>

          <IconButton onClick={handleDecrease}>
            <MinusIcon className="icon" />
          </IconButton>
          <Typography fontSize={12} fontWeight={700}>
            {value}
          </Typography>
          <IconButton onClick={handleIncrease}>
            <PlusIcon className="icon" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
