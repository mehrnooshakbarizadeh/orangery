// external dependencies
import {
  Box,
  Typography
} from "@mui/material";

// icons, images & colors
import AppDefaultAvatarBackground from "../../assets/svg/apps/app-default-avatar-background.svg";

export default function OrangeryAppAvatar({
  name,
  size,
  fileName
}: {
  name: string,
  size?: number,
  fileName?: string
}) {

  return (
    <Box
      sx={{
        width: size || 53,
        height: size || 53,
        flex: "none"
      }}
    >
      {fileName
        // eslint-disable-next-line @next/next/no-img-element
        ? <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${fileName}.jpg`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%"
          }}
          alt=""
        />
        : <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            lineHeight: (size || 53) + "px",
            fontSize: (size ? Math.floor(size / 53 * 20) : 20) + "px",
            color: "#f1ca04e8",
            textAlign: "center",
            transition: "0.3s",
            "& .image": {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              lineHeight: (size || 53) + "px",
              fontSize: (size ? Math.floor(size / 53 * 20) : 20) + "px",
              color: "#f1ca04e8",
            }
          }}
        >
          <AppDefaultAvatarBackground className="image" />
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: "#2B2E33",

              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {name?.substr(0, 2).toUpperCase()}
          </Typography>
        </Box>
      }
    </Box >
  );
}