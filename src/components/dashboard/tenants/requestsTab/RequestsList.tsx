// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import theme from "../../../../Contexts & Globals/theme";

// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryGlobalFilter,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryPrice,
  OrangeryTooltip,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import {
  ITenantRequest,
  useProductRequestList,
  useTenantRequestList,
} from "../../../../queries/tenantRequest";

// icons, images & colors
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import ThumbsDownIcon from "../../../../assets/svg/thumbs-down.svg";
import ThumbsUpIcon from "../../../../assets/svg/thumbs-up.svg";
import MemoIcon from "../../../../assets/svg/memo.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/offer-list.svg";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function RequestsList() {
  const globalState = useGlobalState();
  const { data: tenant_requests, isLoading } = useProductRequestList(
    globalState.office_uuid
  );

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : tenant_requests && tenant_requests.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            pt: 3,
          }}
        >
          <Box
            sx={{
              height: `calc(100% - 12px)`,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
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
            }}
          >
            {tenant_requests.map((tenant_request) => (
              <RequestRow key={tenant_request.uuid} request={tenant_request} />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No Request!"}
          subtitle={"No requests for your offers."}
          PlaceholderSvg={PlaceholderSvg}
        />
      )}
    </>
  );
}

function RequestRow({ request }: { request?: ITenantRequest }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2.7,
          px: 2.4,
          mb: 1.2,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          mx: 0,
          rowGap: 2,
          fontSize: 16,
          fontWeight: 500,
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexBasis: "26%",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f2f1f178",
              justifyContent: "center",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
          >
            <Box
              sx={{
                width: "60px",
                height: "60px",
              }}
              component={"img"}
              src={
                request?.product_image
                  ? request?.has_thumbnail
                    ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${request?.product_image}.jpg`
                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${request?.product_image}.jpg`
                  : `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`
              }
              loading={"lazy"}
            />
          </Box>
          <Box className="column-align">
            <Typography variant="h4">
              <OrangeryText text={request?.product_name} limit={50} />
            </Typography>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                gap: 1,
                "& .memo-icon": { width: "1rem", height: "1rem" },
                "& .memo-disable-icon": {
                  height: "1rem",
                  width: "1rem",
                  color: "#b7b2b2",
                },
              }}
            >
              <Typography variant="h6">Description</Typography>
              {request?.product_description ? (
                <OrangeryTooltip
                  title={request.product_description}
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <Box>
                    <IconButton sx={{ "&.MuiIconButton-root": { p: 0 } }}>
                      <MemoIcon className="memo-icon" />
                    </IconButton>
                  </Box>
                </OrangeryTooltip>
              ) : (
                <OrangeryTooltip
                  title="No Description"
                  placement="bottom-start"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    sx={{ "&.MuiIconButton-root": { p: 0 }, cursor: "default" }}
                  >
                    <MemoIcon className="memo-disable-icon" />
                  </IconButton>
                </OrangeryTooltip>
              )}
            </Box>
          </Box>
        </Box>
        <Box className="column-align" sx={{ flexBasis: "26%" }}>
          <Typography variant="h6" color="#A5AAB4">
            NAME
          </Typography>
          <Typography variant="h4">
            <OrangeryText text={`${request?.first_name} ${request?.last_name}`} limit={30} />
          </Typography>
          <Typography
            fontSize={15}
            fontWeight={600}
            sx={{ textDecoration: "underline" }}
          >
            {request?.email ? request?.email : "-"}
          </Typography>
        </Box>
        <Box className="column-align" sx={{ flexBasis: "22%" }}>
          <Typography variant="h6" color="#A5AAB4">
            ADDRESS
          </Typography>
          <Typography variant="h4">
            {request?.address ? request?.address : "-"}
          </Typography>
        </Box>
        <Box className="column-align" sx={{ flexBasis: "14%" }}>
          <Typography variant="h6" color="#A5AAB4">
            PRICE
          </Typography>
          <Typography variant="h4">
            {request?.product_price ? (
              <OrangeryPrice euro={request?.product_price} germanFormat />
            ) : (
              "-"
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            flexBasis: "10%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#A5AAB4",
            "& .thumbs-down-icon": {
              width: "2rem",
              height: "2rem",
              color: request?.reject === true ? "red" : "",
              cursor: "auto",
            },
            "& .thumbs-up-icon": {
              width: "2rem",
              height: "2rem",
              color: request?.accept === true ? "green" : "",
              cursor: "auto",
            },
          }}
        >
          <ThumbsDownIcon className="thumbs-down-icon" />

          <ThumbsUpIcon className="thumbs-up-icon" />
        </Box>
      </Box>
    </>
  );
}

function Header() {
  const [desc, setDesc] = React.useState(false);

  const handleSort = () => {
    setDesc(!desc);
  };
  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          [theme.breakpoints.down("sm")]: { justifyContent: "end" },
          justifyContent: "space-between",
          mb: 2,
          rowGap: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={8}
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            [theme.breakpoints.down("sm")]: { justifyContent: "space-between" },
          }}
        >
          <Grid item xs={9} sm={8} md={8}>
            <OrangeryGlobalFilter />
          </Grid>
          <Grid
            item
            xs={3}
            sm={2}
            md={2}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
              py: 1.3,
              px: 1,
              borderRadius: 1,
              flexShrink: 0,
              "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
              "& .sort-button": { minWidth: 46 },
            }}
          >
            <Button onClick={handleSort} className="sort-button">
              {desc ? (
                <ArrowDownAZIcon className="sort-icon" />
              ) : (
                <ArrowUpZAIcon className="sort-icon" />
              )}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
