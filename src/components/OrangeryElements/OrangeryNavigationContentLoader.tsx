// external dependencies
import { Box } from "@mui/material";
import Lottie from "react-lottie";

// icons, images & colors
// import animationData from "../../assets/loadingAnimations/yellowCircleLoading.json"
import animationData from "../../assets/loadingAnimations/mainOrangeryOSLoading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function OrangeryNavigationContentLoader() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
        <Lottie options={defaultOptions} height={200} width={400} />
      </Box>

      {/* <CircularProgress
        size={100}
        thickness={5}
        color={"inherit"}
        sx={{
          mx: "auto",
          my: "auto"
        }}
      /> */}

      {/*
      // DesksList example
      // needs: react-content-loader package
      <ContentLoader viewBox="0 0 1261.4 632.1">
        {/* Only SVG shapes * /}
      <path fill="#444444" d="M5,82.5h1251.4c2.8,0,5,2.2,5,5v59.9c0,2.8-2.2,5-5,5H5c-2.8,0-5-2.2-5-5V87.5C0,84.8,2.2,82.5,5,82.5z" />
      <path fill="#444444" d="M4.5,403.6h1252.4c2.5,0,4.5,2,4.5,4.5V509c0,2.5-2,4.5-4.5,4.5H4.5c-2.5,0-4.5-2-4.5-4.5V408.1
		C0,405.6,2,403.6,4.5,403.6z"/>
      <path fill="#444444" d="M4.5,524.4h1252.4c2.5,0,4.5,2,4.5,4.4v98.9c0,2.4-2,4.4-4.5,4.4H4.5c-2.5,0-4.5-2-4.5-4.4v-98.9
		C0,526.4,2,524.4,4.5,524.4z"/>
      <path fill="#444444" d="M4.5,164.1h1252.4c2.5,0,4.5,2,4.5,4.5v100.9c0,2.5-2,4.5-4.5,4.5H4.5c-2.5,0-4.5-2-4.5-4.5V168.6
		C0,166.1,2,164.1,4.5,164.1z"/>
      <path fill="#444444" d="M5,0h330.6c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5H5c-2.8,0-5-2.2-5-5V5C0,2.2,2.2,0,5,0z" />
      <path fill="#444444" d="M351.6,0h49.9c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5h-49.9c-2.8,0-5-2.2-5-5V5C346.6,2.2,348.9,0,351.6,0z"
      />
      <path fill="#444444" d="M755.6,0h156.8c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5H755.6c-2.8,0-5-2.2-5-5V5C750.6,2.2,752.8,0,755.6,0z
		"/>
      <path fill="#444444" d="M929.6,0h127.8c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5H929.6c-2.8,0-5-2.2-5-5V5C924.6,2.2,926.9,0,929.6,0z
		"/>
      <path fill="#444444" d="M624.5,0h113.9c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5H624.5c-2.8,0-5-2.2-5-5V5C619.5,2.2,621.8,0,624.5,0z
		"/>
      <path fill="#444444" d="M1074.7,0h181.8c2.8,0,5,2.2,5,5v44.9c0,2.8-2.2,5-5,5h-181.8c-2.8,0-5-2.2-5-5V5
		C1069.7,2.2,1071.9,0,1074.7,0z"/>
      <path fill="#444444" d="M4.5,283.8h1252.4c2.5,0,4.5,2,4.5,4.5v100.9c0,2.5-2,4.5-4.5,4.5H4.5c-2.5,0-4.5-2-4.5-4.5V288.3
		C0,285.8,2,283.8,4.5,283.8z"/>
    </ContentLoader> */}
    </Box>
  );
}
