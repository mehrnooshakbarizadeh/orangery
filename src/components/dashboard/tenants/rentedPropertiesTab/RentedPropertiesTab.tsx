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
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import OverviewContent from "../offersTab/preview/OverviewContent";
import {
  OrangeryGlobalFilter,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  // OrangeryCarousel,
  OrangeryPrice,
  OrangeryTooltip,
  OrangeryText,
} from "../../../OrangeryElements";

// queries & backend
import { IRentedProduct, useRentedProducts } from "../../../../queries/tenant";

// icons, images & colors
// import EyeIcon from "../../../../assets/svg/eye.svg";
import ListCheckedIcon from "../../../../assets/svg/list-checked.svg";
import MemoIcon from "../../../../assets/svg/memo.svg";
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/offer-list.svg";
import EyeNewIcon from "../../../../assets/svg/eye-new.svg";
import RentedPropertiesMenu from "./rentedPropertiesMenu";

export default function RentedPropertiesTab() {
  const globalState = useGlobalState();
  const { data: rentedProduct, isLoading } = useRentedProducts(
    globalState.office_uuid
  );

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : rentedProduct && rentedProduct.length > 0 ? (
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
          {/* <Header /> */}
          <Box
            sx={{
              height: `calc(100% - 12px)`,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
            {rentedProduct.map((rp) => (
              <RentedProductsList key={rp.product.uuid} product={rp} />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Accept Requests!"}
          subtitle={
            "There are rows of rented propertise, if you don't have start to accept some requests."
          }
          PlaceholderSvg={PlaceholderSvg}
        />
      )}
    </>
  );
}

export function RentedProductsList({
  product,
  deleteButton,
  noLinkInOverview,
}: {
  product?: IRentedProduct;
  deleteButton?: JSX.Element;
  noLinkInOverview?: boolean;
}) {
  const [overviewOpen, setOverviewOpen] = useState(false);

  const handleOverviewOpen = () => {
    setOverviewOpen(true);
  };

  const handleOverviewClose = () => {
    setOverviewOpen(false);
  };

  return (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          // justifyContent: "end",
          py: 2.7,
          px: 2.4,
          position: "relative",
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          gap: 1,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
          flex: "none"
        }}
      >
        <Grid item xs={2} sm={1} md={1}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
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
                borderRadius: 2,
                width: "60px",
                height: "60px",
              }}
              component={"img"}
              src={
                product?.product?.images && product?.product?.images.length > 0
                  ? product?.product?.images[0].has_thumbnail
                    ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${product?.product?.images[0].uuid}.jpg`
                    : `${process.env.NEXT_PUBLIC_CDN_URL}/${product?.product?.images[0].uuid}.jpg`
                  : `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/noImage.png`
              }
              loading={"lazy"}
            />
          </Box>
        </Grid>
        <Grid item xs={3} sm={2} md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h4">
            <OrangeryText text={product?.product.name} limit={20} />
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              "& .memo-icon": { width: "1rem", height: "1rem" },
              "& .memo-disable-icon": {
                height: "1rem",
                width: "1rem",
                color: "#b7b2b2",
              },
            }}
          >
            <Typography variant="h6">Description</Typography>
            {product?.product.description ? (
              <OrangeryTooltip
                title={product.product.description}
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
        </Grid>
        <Grid item xs={3} sm={2} md={2}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            TENANT NAME
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography variant="h4">
              <OrangeryText text={product?.user.name} limit={20} />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} sm={2} md={1.8}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography variant="h6" color="#A5AAB4">
              EMAIL
            </Typography>
            <Typography
              variant="h4"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <OrangeryText text={product?.user.email} limit={16} />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} sm={3} md={1.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            COMPANY
          </Typography>
          <Typography variant="h4">
            {product?.product.office.name ? (
              <OrangeryText text={product?.product.office.name} limit={17} />
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={2} md={1.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6" color="#A5AAB4">
            PRICE
          </Typography>
          <Typography variant="h4">
            <OrangeryPrice euro={product?.product.price} germanFormat />
          </Typography>
        </Grid>
        <Grid item xs={3} sm={2} md={0.5}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h6">QUANTITY</Typography>
          <Typography variant="h4">
            {product?.product.rented_quantity ?? "-"}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={3} md={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            justifyContent: "end",
          }}
        >
          {deleteButton}
          <IconButton
            onClick={() => handleOverviewOpen()}
            sx={{
              "& .icon": {
                color: "#000",
                width: "1.3rem",
                height: "1.3rem",
              },
            }}
          >
            {/* <ListCheckedIcon className="icon" /> */}
            <EyeNewIcon className="icon" />
          </IconButton>
          {product?.user_product && product?.user_product?.uuid &&
            <RentedPropertiesMenu userProduct={product.user_product} />
          }
        </Grid>
      </Grid>

      {product && (
        <Dialog
          open={overviewOpen}
          onClose={handleOverviewClose}
          sx={{
            "& .MuiPaper-root": { maxWidth: 1100, width: 1051, height: 752 },
          }}
        >
          <DialogContent sx={{ "&.MuiDialogContent-root": { p: 0 } }}>
            {overviewOpen && (
              <OverviewContent
                overview={product.product}
                noQuantity={true}
                handleDone={handleOverviewClose}
                noLinkInOverview={noLinkInOverview}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
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
            // justifyContent: "space-between",
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
