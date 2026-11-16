// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

// external dependencies
import { Box, Button, IconButton, Typography, Grid } from "@mui/material";
import { Link as MUILink } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import AddNewOfferButton from "../offersTab/AddNewOfferButton";
import {
  OrangeryStatisticBox,
  OrangeryPrice,
  OrangeryCarousel,
  OrangeryNavigationPlaceholder,
  OrangeryText,
  OrangeryNavigationContentLoader,
} from "../../../OrangeryElements";

// queries & backend
import { IStatistics, useStatistic } from "../../../../queries/tenantDashboard";
import { IOffer, useOffers } from "../../../../queries/tenant";
import {
  ITenantRequest,
  useProductRequestList,
  useTenantRequest,
  useTenantRequestList,
} from "../../../../queries/tenantRequest";
// icons, images & colors
import FileInvoiceIcon from "../../../../assets/svg/file-invoice.svg";
import TagIcon from "../../../../assets/svg/tag.svg";
import HandIcon from "../../../../assets/svg/hand.svg";
import ArrowRightIcon from "../../../../assets/svg/arrow-right.svg";
import ThumbsDownIcon from "../../../../assets/svg/thumbs-down.svg";
import ThumbsUpIcon from "../../../../assets/svg/thumbs-up.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/overviewSVG.svg";
import MemoIcon from "../../../../assets/svg/memo.svg";
import { useRoutedTabStore } from "../../../OrangeryElements/OrangeryRoutedTabs";

export default function OverviewTab() {
  const globalState = useGlobalState();
  const {
    data: offers,
    // isLoading,
    isError,
  } = useOffers(globalState.office_uuid);

  const {
    isLoading,
    data: statistic
  } = useStatistic(globalState.office_uuid);

  useEffect(() => {
    if (offers)
      if (offers.length > 0)
        globalState.setShowOffersList(true)
      else
        globalState.setShowOffersList(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers, globalState.currentOffice])

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : globalState.showOffersList && (
        statistic?.number_of_products ||
        statistic?.number_of_tenant_requests ||
        statistic?.rented_products) ? (
        <Overview
          statistic={statistic}
          offers={offers}
        />
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Build a Rental Community"}
          subtitle={
            "Valuate the company's assets by renting them during unused hours."
          }
          AddNewButton={<AddNewOfferButton showOffersList={false} updateAll={true} />}
          PlaceholderSvg={PlaceholderSvg}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function Overview({
  statistic,
  offers,
}: {
  statistic?: IStatistics
  offers?: IOffer[]
}) {
  const globalState = useGlobalState();
  const routedTabStore = useRoutedTabStore();
  const setSelectedTab = routedTabStore?.setSelectedTab;

  const { data: tenant_requests } = useProductRequestList(
    globalState.office_uuid
  );
  // const {
  //   data: offers,
  //   isLoading,
  //   isError,
  // } = useOffers(globalState.office_uuid);

  useEffect(() => {
    console.log(offers?.length)
    if (offers)
      if (offers.length > 0)
        globalState.setShowOffersList(true)
      else
        globalState.setShowOffersList(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers, globalState.currentOffice])

  return (
    <>
      {/* {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : ( */}
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <Grid
          xs={8}
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3.5,
            height: "100%",
            pr: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <OrangeryStatisticBox
              label="Rented Properties"
              icon={<FileInvoiceIcon />}
              statistic={statistic?.rented_products}
            />
            <OrangeryStatisticBox
              label="Offers"
              icon={<TagIcon />}
              statistic={statistic?.number_of_products}
            />
            <OrangeryStatisticBox
              label="Requests"
              icon={<HandIcon />}
              statistic={statistic?.number_of_tenant_requests}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              // width: "100%",
              height: "calc(100% - 302px)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "end", pr: 2 }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                Offers
              </Typography>
              <Button
                sx={{ "& .arrow-icon": { width: "1rem", height: "1rem" } }}
                onClick={() => {
                  setSelectedTab?.("offers", {});
                }}
                endIcon={<ArrowRightIcon className="arrow-icon" />}
              >
                View All
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                pr: 1,
                pb: 1,
                height: "calc(100% - 46px)",
                // width: "100%",
                overflowY: "auto",
                px: 2,
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
              {offers
                ? offers.map((offer: any) => {
                  return <OfferCard key={offer.uuid} offer={offer} />;
                })
                : ""}
            </Box>
          </Box>
        </Grid>
        <Grid
          xs={4}
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3.5,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Tenant Requests
            </Typography>
            <Button
              sx={{ "& .arrow-icon": { width: "1rem", height: "1rem" } }}
              onClick={() => {
                setSelectedTab?.("requests", {});
              }}
              endIcon={<ArrowRightIcon className="arrow-icon" />}
            >
              View All
            </Button>

            {/* <NextLink to= {{
            pathname: "/dashboard/tenants",
            query: { name: 'test' }}}
            >
              <MUILink
                sx={{
                  target: "_blank",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Typography variant="h6">View All</Typography>
                <ArrowRightIcon className="arrow-icon" />
              </MUILink>
            </NextLink> */}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              height: "calc(100% - 12px)",
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
            }}
          >
            <Observer>
              {() => (
                <>
                  {tenant_requests?.map((request) => (
                    <TenantRequestCard key={request.uuid} request={request} />
                  ))}
                </>
              )}
            </Observer>
          </Box>
        </Grid>
      </Grid>
      {/* )} */}
    </>
  );
}

function TenantRequestCard({ request }: { request?: ITenantRequest }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: " 1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          borderRadius: 2,
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
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
              <Observer>
                {() =>
                  request?.product_image ? (
                    <Box
                      sx={{
                        // borderRadius: "50%",
                        width: "60px",
                        height: "60px",
                      }}
                      component={"img"}
                      src={
                        request?.has_thumbnail
                          ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${request?.product_image}.jpg`
                          : `${process.env.NEXT_PUBLIC_CDN_URL}/${request?.product_image}.jpg`
                      }
                      loading={"lazy"}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "60px",
                        height: "60px",
                      }}
                      component={"img"}
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`}
                      loading={"lazy"}
                    />
                  )
                }
              </Observer>
            </Box>
            <Box className="column-align">
              <Observer>
                {() => (
                  <Typography variant="h4">
                    <OrangeryText text={request?.product_name} limit={30} />
                  </Typography>
                )}
              </Observer>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  "& .memo-icon": { width: "1rem", height: "1rem" },
                }}
              >
                <Typography variant="h6">DESCRIPTION</Typography>
                <IconButton>
                  <MemoIcon className="memo-icon" />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box className="column-align">
            <Typography variant="h6">PRICE</Typography>
            <Observer>
              {() => (
                <Typography variant="h4">
                  <OrangeryPrice euro={request?.product_price} germanFormat />
                </Typography>
              )}
            </Observer>
          </Box>
        </Box>
        <Box className="column-align">
          <Typography variant="h6">CUSTOMER NAME</Typography>
          <Observer>
            {() => (
              <Typography variant="h4">
                <OrangeryText
                  text={`${request?.first_name} ${request?.last_name}`}
                  limit={40}
                />
                {/* {request?.first_name}&nbsp;{request?.last_name} */}
              </Typography>
            )}
          </Observer>
          <Observer>
            {() => (
              <Typography variant="h6" sx={{ textDecoration: "underline" }}>
                {request?.email}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // gap: 1,
              flexGrow: 1,
            }}
          >
            <Typography variant="h6">ADDRESS</Typography>
            <Observer>
              {() => <Typography variant="h4">{request?.address}</Typography>}
            </Observer>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#A5AAB4",
              "& .thumbs-down-icon": {
                width: "1.5rem",
                height: "1.5rem",
                color: request?.reject === true ? "red" : "",
              },
              "& .thumbs-up-icon": {
                width: "1.5rem",
                height: "1.5rem",
                color: request?.accept === true ? "green" : "",
              },
            }}
          >
            <ThumbsDownIcon className="thumbs-down-icon" />
            <ThumbsUpIcon className="thumbs-up-icon" />
          </Box>
        </Box>
      </Box>
    </>
  );
}

function OfferCard({ offer }: { offer?: IOffer }) {
  const routedTabStore = useRoutedTabStore();
  const setSelectedTab = routedTabStore?.setSelectedTab;

  return (
    <>
      <Box
        sx={{
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          borderRadius: 2,
          display: "flex",
          backgroundColor: "#F9F9FA",
          gap: 1,
          // alignItems: "center",
          p: 2,
          cursor: "pointer",
        }}
        onClick={() => {
          setSelectedTab?.("offers", {
            offer: offer?.uuid,
          });
        }}
      >
        <Box
          sx={{
            // width: "250px",
            // height: "170px",
            // border: "1px solid #d2d2d2",
            borderRadius: 2,
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "30%",
          }}
        >
          <OrangeryCarousel
            width={250}
            height={170}
            images={offer?.images.map((image) => image.uuid)}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexGrow: 1,
            "& .column-align": { display: "flex", flexDirection: "column" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
            }}
          >
            <Typography variant="h6">OFFER NAME</Typography>
            <Typography variant="h4">
              <OrangeryText text={offer?.name} limit={40} />
            </Typography>
          </Box>
          <Box className="column-align" sx={{ width: "80%" }}>
            <Typography variant="h6">DESCRIPTION</Typography>
            <Typography
              variant="h6"
              sx={{
                whiteSpace: "pre-wrap",
                // width: "400px"
              }}
            >
              <OrangeryText text={offer?.description || "-"} limit={150} />
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexBasis: "15%",
          }}
        >
          <Box className="column-align">
            <Typography variant="h6">SALE PRICE</Typography>
            <Typography variant="h4">
              <OrangeryPrice
                euro={
                  parseFloat((offer?.sale_price ?? 0).toString()) > 0
                    ? offer?.sale_price
                    : offer?.price
                }
                germanFormat
              />
              {offer?.payment_method === "subscription" ? "/m" : ""}
            </Typography>
          </Box>
          <Box className="column-align">
            <Typography variant="h6">QUANTITY</Typography>
            <Typography variant="h4">{offer?.quantity}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
