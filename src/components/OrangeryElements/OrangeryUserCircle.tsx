// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

function OrangeryUserCircle({
  name,
  size,
  notHoverable,
  fileName,
  noMargin,
  onClick,
  withCheckinDot,
  checkedIn,
  sx,
}: {
  name: string;
  size?: number;
  notHoverable?: any;
  fileName?: string;
  noMargin?: boolean;
  onClick?: any;
  withCheckinDot?: boolean;
  checkedIn?: boolean;
  sx?: any;
}) {
  const [hover, setHover] = React.useState(0);

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size || 53,
        height: size || 53,
        cursor: notHoverable ? "default" : "pointer",
        ...(!noMargin ? { mr: hover ? "-7px" : "-15px" } : {}),
        transition: "0.3s",
        flex: "none",
        position: "relative",
        ...sx,
      }}
    >
      {withCheckinDot && (
        <Box
          sx={{
            height: 9,
            width: 9,
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: checkedIn ? "#09C176" : "#C10909",
            borderRadius: 99999,
            border: "1px solid white",
          }}
        />
      )}
      {/* <Box sx={{
        pl: 2,
        pr: 2,
        height: 30,
        textAlign: "center",
        lineHeight: 28,
        color: "white",
        backgroundColor: "black",
        position: "absolute",
        ml: "0px",
        mt: "-38px",
        transition: "0.3s",
        opacity: hover,
        borderRadius: "86px",
      }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, mt: "-1px" }}>
          {name}
        </Typography>
      </Box> */}
      {fileName ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${fileName}.jpg`}
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid white",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          alt=""
        />
      ) : (
        <Box
          onMouseOver={() => setHover(true && !notHoverable ? 1 : 0)}
          onMouseOut={() => setHover(0)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            lineHeight: (size || 53) + "px",
            fontSize: (size ? Math.floor((size / 53) * 20) : 20) + "px",
            borderRadius: 100,
            backgroundColor: "black",
            color: "#f1ca04e8",
            textAlign: "center",
            transition: "0.3s",
            border: "1px solid white",
            ":hover": {
              backgroundColor: "#212121",
              cursor: "pointer",
              color: "white",
            },
          }}
        >
          {name?.substring(0, 2).toUpperCase()}
        </Box>
      )}
    </Box>
  );
}

export default OrangeryUserCircle;
