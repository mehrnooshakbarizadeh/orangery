// external dependencies
import { Box } from "@mui/material";
import Lottie from "react-lottie";

// icons, images & colors
import animationData from "../../../../../assets/svg/apps/googleAdminResources/two-arrows-loading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function GoogleLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        borderRadius: 1.5,
        color: "#000",
        backgroundColor: "#F9F9FA",
      }}
    >
      <Box
        sx={{
          my: "auto",
          mx: "auto",
        }}
      >
        <Lottie options={defaultOptions} height={40} width={40} />
      </Box>
    </Box>
  );
}
