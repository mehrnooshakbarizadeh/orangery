// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
} from "@mui/material";
import OrangeryCloseButton from "./OrangeryCloseButton";

// orangery elements & internal dependencies
//

// queries & backend
//

export default function OrangeryFormWrapper({
  onSubmit,
  onClose,
  title,
  withBorder,
  children,
  footer,
  style = {}
}: {
  onSubmit?: (e: React.FormEvent) => void;
  onClose?: () => void;
  title: string;
  withBorder?: boolean;
  children: JSX.Element | JSX.Element[];
  footer?: JSX.Element | JSX.Element[];
  style?: any; ////////!!!!!!!!! type?
}) {
  function handleSubmit(e: React.FormEvent) {
    if (onSubmit)
      onSubmit(e)
  }

  return <form
    onSubmit={handleSubmit}
    style={{
      display: "flex",
      flexDirection: "column",
      // height: "100%",
      // width: "100%"
      ...style,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        pr: 3,
        pl: 4,
        pt: 2.5,
        pb: 2,
        ...(withBorder ? { borderBottom: "1px solid #EDEEF0" } : {}),
      }}
    >
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80%",
          color: "#2B2E33"
        }}
      >
        {title}
      </Typography>
      {onClose && <OrangeryCloseButton onClose={onClose} noAbsolute />}
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      {children}
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        px: 2,
        py: 2,
        ...(withBorder ? { borderTop: "1px solid #EDEEF0" } : {}),
      }}
    >
      {footer}
    </Box>
  </form>
}