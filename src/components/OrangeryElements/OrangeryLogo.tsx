// external dependencies
import { Box } from "@mui/material";

function OrangeryLogo() {
  return (
    <Box
      sx={{
        width: "210px",
        height: "36px",
      }}
      component={"img"}
      src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Orangery-OS.png`}
      loading={"lazy"}
    />
  );
}

export default OrangeryLogo;
