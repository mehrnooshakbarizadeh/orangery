// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useRouter } from "next/router";

// external dependencies
import {
  Box,
  Button,
  Grid,
  Fade,
  IconButton,
  Typography,
  Link as MUILink,
} from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryCircleLoading, OrangeryPrice } from "../../OrangeryElements";

// queries & backend
import {
  ITenantPayment,
  useTenantPayments,
} from "../../../queries/tenantPayment";

// icons, images & colors
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg";
import DocsIcon from "../../../assets/svg/dashboard/docs.svg";

export default function OverviewTenantPaymentsList() {
  const { office_uuid } = useGlobalState();
  const {
    data: tenantPayments,
    isLoading,
    isError,
  } = useTenantPayments(office_uuid);

  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "#212B45",
        height: "100%",
        borderRadius: 2.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff1f",
          width: "68%",
          height: "143%",
          borderRadius: 9999,
          position: "absolute",
          top: "50%",
          left: "40%",
          filter: "blur(121px)",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          borderRadius: 2.5,
          gap: 2,
          p: 2,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 25,
              color: "white",
              flexGrow: 1,
            }}
          >
            Latest Payments
          </Typography>
          {tenantPayments && tenantPayments.length > 0 && (
            <Button
              sx={{
                color: "white",
                "& .icon": { width: "1rem", height: "1rem" },
              }}
              onClick={() => {
                router.push("/dashboard/payment/?tab=tenants_payment");
              }}
              endIcon={<ArrowRightIcon className="icon" />}
            >
              View All
            </Button>
          )}
        </Box>
        <Box
          sx={{
            overflowY: "auto",
            height: "calc(100% - 12px)",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            "&::-webkit-scrollbar": {
              width: "0.3rem",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
              backgroundColor: "#000000",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#A6A6A6", // "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                my: "auto",
                mx: "auto",
                color: "white",
              }}
            >
              <OrangeryCircleLoading />
            </Box>
          ) : tenantPayments && tenantPayments.length > 0 ? (
            tenantPayments?.map((tenantPayment: ITenantPayment) => (
              <TenantPaymentRow
                key={tenantPayment.uuid}
                tenantPayment={tenantPayment}
              />
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mx: "auto",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
              }}
            >
              <DocsIcon style={{ width: 138, height: 123 }} />
              <Typography
                sx={{
                  color: "white",
                  textAlign: "center",
                  mt: 1,
                  fontSize: "21px",
                  fontWeight: 400,
                }}
              >
                No payments found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function TenantPaymentRow({
  tenantPayment,
}: {
  tenantPayment: ITenantPayment;
}) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "1px 1px 8px #0000000a",
        borderBottom: "1px solid #0D1325",
        alignItems: "center",
        mx: 0,
        pb: 1,
        rowGap: 2,
        color: "white",
        "& .column-align": {
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
        },
      }}
    >
      <Grid
        item
        xs={3}
        // sm={3}
        // md={1.5}
        // xl={1}
        className="column-align"
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 10,
            fontWeight: 400,
          }}
        >
          Invoice Number
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {tenantPayment.invoice_number}
        </Typography>
      </Grid>
      <Grid
        item
        xs={5}
        // sm={9}
        // md={3.75}
        // xl={2}
        className="column-align"
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 10,
            fontWeight: 400,
          }}
        >
          Title
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            // wordBreak: "break-all"
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            pr: 1,
          }}
        >
          {tenantPayment.name}
        </Typography>
      </Grid>
      <Grid
        item
        xs={2.5}
        // sm={6}
        // md={2}
        // xl={1.25}
        className="column-align"
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 10,
            fontWeight: 400,
          }}
        >
          Date
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {new Date(tenantPayment.date).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </Typography>
      </Grid>
      <Grid
        item
        xs={1.5}
        // sm={3}
        // md={1.25}
        // xl={.75}
        className="column-align"
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 10,
            fontWeight: 400,
          }}
        >
          Amount
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <OrangeryPrice euro={tenantPayment.total} germanFormat />
        </Typography>
      </Grid>
    </Grid>
  );
}
