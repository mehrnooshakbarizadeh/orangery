/* eslint-disable @next/next/no-img-element */

// external dependencies
import { Box, Typography } from "@mui/material";

export default function OrangeryNavigationPlaceholder({
  vertical,
  minHeight,
  PlaceholderSvg,
  width,
  height,
  title,
  subtitle,
  AddNewButton,
  CopyRegisterLink,
  AddCSVButton,
  addNewButtonText,
  smallFont,
}: {
  vertical?: boolean;
  minHeight?: number | string;
  PlaceholderSvg: any;
  width?: number | string;
  height?: number | string;
  title?: string;
  subtitle?: string;
  AddNewButton?: JSX.Element;
  CopyRegisterLink?: JSX.Element;
  AddCSVButton?: JSX.Element;
  addNewButtonText?: string;
  smallFont?: boolean;
}) {
  return (
    <>
      {" "}
      {!vertical ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            height: "100%",
            width: "100%",
            minHeight: minHeight ?? 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,

            justifyContent: "center",
            // alignItems: "flex-end",
          }}
        >
          <Box
            sx={{
              placeItems: "center center",
              display: "flex",
              mx: "auto",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <PlaceholderSvg
              width={width ?? 450}
              height={height ?? "auto"}
              sx={{
                flex: "none",
              }}
            />
            <Box
              sx={{
                marginTop: 2,
                flexBasis: "39.8rem",
              }}
            >
              <Typography
                sx={{ color: "black", fontSize: 33, fontWeight: 800 }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontSize: 22,
                  fontWeight: 400,
                  marginTop: 1,
                }}
              >
                {subtitle}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexShrink: 0,
                  marginTop: 4,
                  gap: 2,
                }}
              >
                <Box>
                  {AddNewButton}
                </Box>

                <Box>
                  {CopyRegisterLink}
                </Box>

                <Box>
                  {AddCSVButton}
                </Box>
                <Typography
                  sx={{
                    color: "black",
                    fontSize: 26,
                    fontWeight: 600,
                    marginTop: 1,
                    marginLeft: 2,
                  }}
                >
                  {addNewButtonText ?? ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            height: "100%",
            width: "100%",
            minHeight: minHeight ?? 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mb: 7,
            }}
          >
            <PlaceholderSvg
              width={width ?? 450}
              height={height ?? "auto"}
              sx={{
                flex: "none",
              }}
            />
          </Box>
          <Typography
            sx={{
              color: "black",
              fontSize: smallFont ? 20 : 32,
              fontWeight: 800,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: "#A5AAB4",
              fontSize: 26,
              fontWeight: 400,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexShrink: 0,
              marginTop: 8,
            }}
          >
            {AddNewButton}
            <Typography
              sx={{
                color: "black",
                fontSize: 26,
                fontWeight: 600,
                marginTop: 1,
                marginLeft: 2,
              }}
            >
              {addNewButtonText ?? ""}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
