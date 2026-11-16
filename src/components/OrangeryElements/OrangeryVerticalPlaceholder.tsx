/* eslint-disable @next/next/no-img-element */

// external dependencies
import { Box, Typography } from "@mui/material";

// icons, images & colors
import GreenCheck from "../../assets/svg/dashboard/GreenCheck.svg"

export default function OrangeryVerticalPlaceholder({
  count,
  subtitle,
  placeholderSvg,
  addNewButton,
}: {
  count: number
  subtitle: string
  placeholderSvg: JSX.Element
  addNewButton: JSX.Element
}) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#F8F8F8",

          display: "flex",
          flexDirection: "column",

          height: 500,
          maxHeight: 500,
          maxWidth: 450,
          minWidth: 350,
          borderRadius: 1.5,
          pt: 6,
          pb: 3,
          px: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            "& svg": {
              width: "auto",
              height: 150,
              flex: "none"
            }
          }}
        >
          {placeholderSvg}
        </Box>

        <Typography
          sx={{ color: "primary", fontSize: 18, fontWeight: 600, mt: 4, mb: 2 }}
        >
          {subtitle}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            flexShrink: 0,
            mt: "auto",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              height: 42
            }}
          >
            {count > 0 &&
              <GreenCheck />
            }
          </Box>

          {addNewButton}
          <Typography
            sx={{
              color: "primary",
              fontSize: 18,
              fontWeight: 500,
              height: 28
            }}
          >
            {count > 0
              ? `${count} item${count === 1 ? "" : "s"} added`
              : " "
            }
          </Typography>
        </Box>
      </Box>
    </>
  );
}
