// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import { CopyToClipboard } from "react-copy-to-clipboard";

// orangery elements & internal dependencies
import PreviewContent from "./PreviewContent";
import PreviewContract from "./PreviewContract";
import OverviewSelectedItems from "./OverviewSelectedItems";
import { OrangeryCarousel } from "../../../../OrangeryElements";

// queries & backend
import { IOfferResult } from "../../../../../queries/tenant";

// icons, images & colors
import CrossIcon from "../../../../../assets/svg/cross.svg";
import CopyIcon from "../../../../../assets/svg/copy.svg";

export default function OverviewContent({
  overview,
  noQuantity,
  handleDone,
  noLinkInOverview,
}: {
  overview: IOfferResult;
  noQuantity?: boolean;
  handleDone: () => void;
  noLinkInOverview?: boolean;
}) {
  return (
    <>
      <Box
        sx={{
          height: "100%",
          "& .footer": {
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
            px: 4,
            py: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            py: 2,
            px: 4,
            "& .form-title": { flexGrow: 1 },
            "& .cancel-icon": {
              width: "1.3rem",
              height: "1.3rem",
              color: "black",
            },
          }}
        >
          <Typography variant="h2" className="form-title">
            Overview
          </Typography>
          <IconButton onClick={handleDone}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            mt: 2,
            mr: 2,
            height: "calc(100% - 220px)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
            p: 4,
            "& .content-first-row": {
              display: "flex",
              gap: 3,
              pt: 2,
            },
            "& .left-box": { width: "33%" },
            "& .center-box": { width: "55%" },
            "& .right-box": { width: "32%" },
          }}
        >
          <Typography variant="h4">Preview</Typography>
          <Box className="content-first-row">
            <Box className="left-box">
              <OrangeryCarousel
                images={overview.images.map((image) => image.uuid)}
              />
            </Box>
            <Box className="center-box">
              <PreviewContent offer={overview} noQuantity={noQuantity} />
            </Box>
            <Box className="right-box">
              <PreviewContract offer={overview} />
            </Box>
          </Box>
          <Box className="content-second-row">
            <Box sx={{ pb: 3 }}>
              <Typography variant="h2">Items</Typography>
              <Observer>
                {() => (
                  <Typography fontSize={18} fontWeight={400} color="#55585C">
                    You have Selected{" "}
                    {overview.assets?.length +
                      overview.desks?.length +
                      overview.rooms?.length}{" "}
                    Items
                  </Typography>
                )}
              </Observer>
            </Box>
            {overview.desks?.length ||
              overview.assets?.length ||
              overview.rooms?.length > 0 ? (
              <OverviewSelectedItems offer={overview} />
            ) : (
              <Stack spacing={1}>
                {/* <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={80}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={80}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={80}
                  sx={{ borderRadius: 1 }}
                /> */}
              </Stack>
            )}
            {/* <OverviewSelectedItems offer={overview} /> */}
          </Box>
        </Box>
        <Box className="footer">
          {!noLinkInOverview && (
            <Box sx={{ flexGrow: 1 }}>
              <ShareOffer offer={overview} />
            </Box>
          )}
          <Box>
            <Button
              onClick={handleDone}
              variant="contained"
              sx={{ fontSize: 20, px: 8, py: 2 }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function ShareOffer({ offer }: { offer?: IOfferResult }) {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Box sx={{ width: "55%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h3">Share your offer</Typography>
          <CopyToClipboard
            text={`${process.env.NEXT_PUBLIC_CHECKOUT_URL}/offer/?id=${offer?.uuid}`}
            onCopy={() => setCopied(true)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#EDEEF0",
                borderRadius: 1,
                p: 1.3,
                "& .copy-icon": {
                  width: "1.3rem",
                  height: "1.3rem",
                  color: "#55585C",
                },
              }}
            >
              <Typography fontSize={16} fontWeight="600" color="#A5AAB4">
                {process.env.NEXT_PUBLIC_CHECKOUT_URL}/offer...
              </Typography>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={handleTooltipClose}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title="Copied"
                  >
                    <span>
                      <IconButton onClick={handleTooltipOpen}>
                        <CopyIcon className="copy-icon" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              </ClickAwayListener>
            </Box>
          </CopyToClipboard>
        </Box>
      </Box>
    </>
  );
}
