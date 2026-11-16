// external dependencies
import { Box } from "@mui/material";
import Lottie from "react-lottie";

// icons, images & colors
import welcomeOrangery from "../../../../assets/loadingAnimations/WelcomeToOrangeryOS.json";

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: welcomeOrangery,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function WelcomeOrangeryAnimation() {
  return (
    <Box
      sx={{
        backgroundColor: "#F9D507",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        width: "100%",
        height: "100%",
        // minHeight: 600,
        borderRadius: 1.5,
        py: 3,
        px: 2,
        color: "#C4C4C4",
      }}
    >
      <Box
        sx={{
          my: "auto",
          mx: "auto",
        }}
      >
        <Lottie options={defaultOptions} height={500} width={600} />
      </Box>
    </Box>
  );
}
