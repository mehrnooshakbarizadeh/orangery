// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import { Box, Typography, IconButton } from "@mui/material";

// icons, images & colors
// import LayerIcon from "../../assets/svg/layer.svg";
// import ArrowRightRegular from "../../assets/svg/arrow-right-regular.svg";
import ArrowUpIcon from "../../assets/svg/arrowUpFull.svg";
import ArrowDownIcon from "../../assets/svg/arrowDownFull.svg";
import PercentIcon from "../../assets/svg/percent.svg";
import ArrowRightIcon from "../../assets/svg/arrow-right.svg";

export interface IItem {
  label: string;
  value: string | number;
  valueNote?: string | number;
  rate?: string | number;
  url?: string
}

export default function OrangeryBoxCard({
  item
}: {
  item: IItem
}) {
  const router = useRouter();

  const positiveOrNegative = item.rate?.toString().includes("-") ? false : true;

  return (
    <Box
      sx={{
        // height: {
        //   xs: 200,
        //   lg: 250
        // },
        width: "100%",
        pr: {
          xs: 2,
          xl: 2,
        },
        pl: {
          xs: 1.5,
          xl: 3
        },
        pt: {
          xs: 2.5,
          md: 0,
          xl: 1.25
        },
        pb: {
          xs: 2,
          md: 0,
          xl: 1
        },
        textAlign: "left",
        borderRadius: 2.5,
        transition: "0.3s",
        backgroundColor: "white",
        minHeight: 120,
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "relative"
      }}
    >
      {item.url &&
        <IconButton
          onClick={() => {
            router.push(item.url ?? "")
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 8,
            "& .icon": {
              color: "#074EE8",
              width: 13
            }
          }}
        >
          <ArrowRightIcon className="icon" />
        </IconButton>
      }
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: 0,
            lg: 1
          }
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 16,
            color: "#55585C",
            // textTransform: "uppercase"
          }}
        >
          {item.label}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
              xl: "column"
            },
            gap: {
              xs: 0,
              lg: 1
            },
            alignItems: {
              xs: "unset",
              md: "baseline",
              xl: "unset"
            },
            justifyContent: {
              xs: "unset",
              md: "space-between",
              xl: "unset"
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline"
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 53,
                lineHeight: "60px",
                color: "#2B2E33"
              }}>
              {item.value}
            </Typography>
            {item.valueNote &&
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 25,
                  // lineHeight: "60px",
                  color: "lightgray"
                }}>
                {item.valueNote}
              </Typography>
            }
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 14,
              mt: .5
            }}
          >
            {item.rate &&
              <>
                {positiveOrNegative
                  ? <ArrowUpIcon style={{ height: 12 }} />
                  : <ArrowDownIcon style={{ height: 12 }} />
                }
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: positiveOrNegative ? "#09C176" : "#C10909",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    {item.rate}
                  </Typography>
                  <Box>
                    <PercentIcon
                      style={{
                        height: 10,
                        color: positiveOrNegative ? "#09C176" : "#C10909",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: positiveOrNegative ? "#09C176" : "#C10909",
                      fontSize: 14,
                      fontWeight: 400,
                      ml: 1
                    }}
                  >
                    to Last Month
                  </Typography>
                </Box>
              </>
            }
          </Box>
        </Box>
      </Box>
    </Box>
  );
}