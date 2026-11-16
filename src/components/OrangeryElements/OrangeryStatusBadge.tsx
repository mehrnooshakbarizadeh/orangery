// external dependencies
import { alpha, Box, Switch, SwitchProps, Typography } from "@mui/material";

export default function OrangeryStatusBadge({
  sx,
  status,
  ...props
}: {
  status?: string;
} & SwitchProps) {
  let statusAndColor = ["status", "color", "bg"];
  const statusSwitch = (statusType?: string) => {
    if (statusType === "in_use") {
      statusAndColor[0] = "In use";
      statusAndColor[1] = "#FF3D00";
      statusAndColor[2] = "rgba(255, 61, 0, 0.1);";
      return statusAndColor;
    } else if (statusType === "reserved") {
      statusAndColor[0] = "Reserved";
      statusAndColor[1] = "#FF9900";
      statusAndColor[2] = "rgba(255, 153, 0, 0.1);";
      return statusAndColor;
    } else {
      statusAndColor[0] = "Free to use";
      statusAndColor[1] = "#42B863";
      statusAndColor[2] = "56CA29";
      return statusAndColor;
    }
  };

  return (
    <>
      <Box
        sx={{
          ...sx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // py: 0.9,
          px: "10px",
          width: 145,
          height: 44,
          borderRadius: "36px",
          fontSize: 17,
          fontWeight: 400,
          gap: 1.5,
          backgroundColor: statusSwitch(status)[2],
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            backgroundColor: statusSwitch(status)[2],
            borderRadius: "100%",
          }}
        />
        <Box>
          <>
            <Typography variant="h5" sx={{ color: statusSwitch(status)[1] }}>
              {statusSwitch(status)[0]}
            </Typography>
          </>
        </Box>
      </Box>
    </>
  );
}
