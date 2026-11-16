import { Box, SwitchProps, Typography, Grid } from "@mui/material";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { ICoupon, useCoupons } from "../../../../queries/coupon";
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryReadOnlySwitch,
  OrangeryText,
  OrangeryUserCircle,
  // OrangeryTag
} from "../../../OrangeryElements";
import AddNewCouponButton from "./AddNewCouponButton";
import PlaceholderSvg from "../../../../assets/svg/placeholders/coupon.svg";
import React from "react";
import EditCouponButton from "./EditCouponButton";
import { Observer } from "mobx-react-lite";

export default function CouponsList() {
  const globalState = useGlobalState();
  const {
    data: coupons,
    isLoading,
    isError,
  } = useCoupons(globalState.office_uuid);

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : coupons && coupons.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          <Header button={<AddNewCouponButton />} />
          <Box
            sx={{
              pr: 1,
              overflowY: "auto",
              display: "flex",
              gap: 1,
              flexDirection: "column",
              height: `calc(100% - 76px)`,
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
                  {coupons?.map((coupon) => (
                    <CouponCard key={coupon.uuid} coupon={coupon} />
                  ))}
                </>
              )}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"Create a new coupon"}
          subtitle={"Offer new benefits to your customers"}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<AddNewCouponButton />}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function CouponCard({ coupon }: { coupon: ICoupon }) {
  let today = new Date();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 3,
          px: 2,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          // mb: 1.2,
          mx: 0,
          rowGap: 2,
          fontSize: 16,
          fontWeight: 500,
          "& .cell-align": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mr: 2,
            width: "10%",
            flexBasis: "10px",
            flexShrink: 0,
            flexGrow: 1,
            "& .file-name": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
        }}
      >
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            NAME
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4">
                <OrangeryText text={coupon.discount_code || "-"} limit={15} />
              </Typography>
            )}
          </Observer>
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            DISCOUNT
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4" className="file-name">
                {coupon.amount ? coupon.amount : "-"}
                {coupon.discount_type === "€" ? "€" : "%"}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            QUANTITY
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4">
                {coupon.quantity ? coupon.quantity : "-"}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            USED
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4">
                {coupon.stock && coupon.quantity
                  ? coupon.quantity - coupon.stock
                  : "0"}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            ASSIGNED TO
          </Typography>
          {coupon.users?.length > 0 ? (
            <Observer>
              {() => (
                <Box sx={{ display: "flex" }}>
                  {coupon.users.map((user) => (
                    <OrangeryUserCircle
                      key={user.name}
                      name={user.name ?? user.first_name + " " + user.last_name}
                      fileName={
                        typeof user?.image === "string"
                          ? user?.image
                          : undefined
                      }
                      size={32}
                    />
                  ))}
                </Box>
              )}
            </Observer>
          ) : (
            <Typography variant="h4" className="file-name">
              -
            </Typography>
          )}
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            OFFERS
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4" className="file-name">
                {coupon.products?.length ? coupon.products.length : "-"}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box className="cell-align">
          <Typography variant="h6" color="#A5AAB4">
            LIMIT 1 PER CUSTOMER
          </Typography>
          <Observer>
            {() => (
              <Typography variant="h4" className="file-name">
                {coupon.multi_use ? "Yes" : "No"}
              </Typography>
            )}
          </Observer>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* <Observer>
          {() => (
            <OrangeryTag
              label={{ checked: "Published", unchecked: "Draft" }}
              checked={coupon.published}
            />
          )}
        </Observer> */}
          <Observer>
            {() => (
              <OrangeryReadOnlySwitch
                pending={
                  coupon.expire_date && new Date(coupon.expire_date) < today
                }
                label={{
                  checked: "Active",
                  unchecked: "Inactive",
                  pending: "Expired",
                }}
                checked={coupon.active}
              />
            )}
          </Observer>
          <Box>
            <Observer>
              {() => (
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flex: "none",
                    textAlign: "right",
                    ml: 2,
                  }}
                >
                  <EditCouponButton coupon={coupon} />
                </Grid>
              )}
            </Observer>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Header({ button }: { button?: JSX.Element }) {
  const [desc, setDesc] = React.useState(false);

  const handleSort = () => {
    setDesc(!desc);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mb: 2,
          flexFlow: {
            sx: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box sx={{ minWidth: 300, maxWidth: 400 }}>{ }</Box>
          <Box
          // sx={{
          //   backgroundColor: (theme) => theme.palette.grey[200],
          //   py: 1.3,
          //   px: 1,
          //   borderRadius: 1,
          //   flexShrink: 0,
          //   "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
          //   "& .sort-button": { minWidth: 46 },
          // }}
          >
            {/* <Button onClick={handleSort} className="sort-button">
                {desc ? (
                  <ArrowDownAZIcon className="sort-icon" />
                ) : (
                  <ArrowUpZAIcon className="sort-icon" />
                )}
              </Button> */}
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            ml: 3,
          }}
        >
          {button}
        </Box>
      </Box>
    </>
  );
}
