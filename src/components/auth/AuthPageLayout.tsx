// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryLogo,
  OrangeryChangeLanguageButton,
} from "../OrangeryElements";

export default function AuthPageLayout({
  children,
  image,
  title,
  subtitle,
  secondSubtitle,
  bottomLabel,
}: {
  children: React.ReactNode;
  image: string;
  title: string;
  subtitle?: string;
  secondSubtitle?: React.ReactNode;
  bottomLabel: React.ReactNode;
}) {
  const globalState = useGlobalState();
  return (
    <Box
      id={"auth_background"}
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: 3000,
          height: 3000,
          transform: "rotate(60deg) translate(-50%,-45%)",
          background: "#F9D507",
          position: "fixed",
        }}
      ></Box>
      <Box
        component="main"
        sx={{
          height: {
            md: "97%",
          },
          width: {
            md: "97%",
          },
          maxWidth: "1550px",
          maxHeight: "1050px",
          backgroundColor: "transparent",
          borderRadius: "15px",
          margin: "auto",

          // boxShadow: "1px 1px 7px #00000026",
          px: 8,
          pt: 6,
          pb: 4.5,
          position: "relative",
        }}
      >
        <Grid container height="100%">
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Box sx={{}}>
                <OrangeryLogo />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: 32,
                  right: 48,
                }}
              >
                <OrangeryChangeLanguageButton />
              </Box>

              <Box
                sx={{
                  // mb: 8,
                  // pr: 5,
                  // paddingLeft: {
                  //   xs: 2.5,
                  //   sm: 2.5,
                  //   md: 5,
                  // },
                  // paddingRight: {
                  //   xs: 2.5,
                  //   sm: 2.5,
                  //   md: 5,
                  // },
                  // p: 8,
                  // py: {
                  //   xs: 1,
                  //   md: 1,
                  // },
                  // px: {
                  //   xs: 2.5,
                  //   md: 5,
                  // },
                  pr: {
                    md: 8,
                  },
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  alignItems: "flex-stretch",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    fontSize: 34,
                    color: "#324577",
                    mt: subtitle && secondSubtitle ? 24 : 8,
                    mb: subtitle ? 1 : 8,
                  }}
                >
                  {title}
                </Typography>

                {subtitle && (
                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#55585C",
                      mt: 0,
                      mb: 8,
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}

                {subtitle && secondSubtitle && (
                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#55585C",
                      mt: 0,
                      mb: 8,
                    }}
                  >
                    {secondSubtitle}
                  </Typography>
                )}

                <Box
                  sx={{
                    my: "auto",
                  }}
                >
                  {children}
                </Box>

                <Typography
                  color={(theme) => theme.palette.primary.main}
                  sx={{
                    alignItems: "baseline",
                    fontWeight: 600,
                    display: "flex",
                    mr: "auto",
                    mt: "auto",
                    fontSize: 20,
                  }}
                >
                  {bottomLabel}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            sx={{
              display: {
                xs: "none",
                sm: "inherit",
                md: "inherit",
              },
            }}
          >
            <Box
              sx={{
                padding: 2,
                width: "100%",
                height: "auto",
                my: "auto",
              }}
            >
              <Box
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  mb: 4,
                }}
                component={"img"}
                src={image}
                loading="lazy"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
