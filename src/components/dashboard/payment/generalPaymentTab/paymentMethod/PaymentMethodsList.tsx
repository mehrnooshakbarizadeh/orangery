// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

// orangery elements & internal dependencies
import AddNewPaymentMethodButton from "./AddNewPaymentMethodButton";
import DeletePaymentMethodButton from "./DeletePaymentMethodButton";
import {
  OrangeryCircleLoading,
  OrangeryGlobalFilter,
  OrangeryReadOnlySwitch,
  OrangeryUserCircle,
} from "../../../../OrangeryElements";

// queries & backend
import {
  IPaymentMethod,
  usePaymentMethod,
} from "../../../../../queries/paymentMethod";

// icons, images & colors
import ArrowDownAZIcon from "../../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../../assets/svg/arrowUpZA.svg";
import PlaceholderImage from "../../../../../assets/svg/payment/undraw_credit_card.svg";
import MasterCard_HotIon from "../../../../../assets/svg/payment/MasterCard_HotIon.svg";
import PaymentMethodsIcon from "../../../../../assets/svg/payment/PaymentMethods.svg";

export default function PaymentMethodsList() {
  const globalState = useGlobalState();
  const { data: paymentMethod, isLoading } = usePaymentMethod();

  return (
    <>
      {isLoading ? (
        <OrangeryCircleLoading />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexFlow: "column",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexFlow: "row",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  color: "grey.A700",
                  marginTop: 1.4,
                  height: "fit-content",
                }}
              >
                <PaymentMethodsIcon />
              </Box>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "grey.A700",
                  marginLeft: 1.5,
                  marginBotton: 1,
                  mr: 4,
                }}
              >
                Payment Method
              </Typography>
            </Box>

            <AddNewPaymentMethodButton />
          </Box>

          <Box
            sx={{
              mt: 4,
              flexGrow: 1,
              display: "flex",
              pb: 12,
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <>
              {paymentMethod ? (
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column",
                  }}
                >
                  <PaymentMethod paymentMethod={paymentMethod} />
                  <Box
                    sx={{
                      my: "2",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <DeletePaymentMethodButton
                        onDelete={() => {}}
                        paymentMethod={{ last4: paymentMethod.last4 }} ////////!!!!!!!!
                        label="Remove"
                        sx={{ color: "red", mt: 2 }}
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    my: "auto",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      mx: "auto",
                      my: "auto",
                      textAlign: "center",
                    }}
                  >
                    <PlaceholderImage />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    No Payment method
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: "18px",
                      fontWeight: 400,
                      maxWidth: "300px",
                      mx: "auto",
                    }}
                  >
                    You don&apos;t have any payment method please add new one
                  </Typography>
                </Box>
              )}
            </>
          </Box>
        </Box>
      )}
    </>
  );
}

function PaymentMethod({ paymentMethod }: { paymentMethod: IPaymentMethod }) {
  return (
    <>
      <Box
        sx={{
          width: "fit-content",
          mt: 2,
        }}
      >
        {paymentMethod.is_sepa_payment ? (
          <Box
            sx={{
              position: "relative",
              width: 335,
              height: 185,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 335,
                height: 185,
              }}
            >
              <MasterCard_HotIon />
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 125,
                left: 30,
                displaye: "flex",
                flexDirection: "column",
                rowGap: 2,
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "white",
                }}
              >
                {paymentMethod.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "white",
                }}
              >
                {"IBAN: " +
                  paymentMethod.country +
                  " **** " +
                  paymentMethod.last4}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Cards
            cvc={"***"}
            expiry={paymentMethod.exp_month + "/" + paymentMethod.exp_year}
            name={paymentMethod.name ?? ""}
            preview={true}
            number={"************" + paymentMethod.last4}
            issuer={paymentMethod.brand?.toLowerCase() ?? ""}
          />
        )}
      </Box>
    </>
  );
}
