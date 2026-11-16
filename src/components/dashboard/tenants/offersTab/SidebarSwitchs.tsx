import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangerySwitch } from "../../../OrangeryElements";
import { OfferFieldsState } from "./HandleOfferForm";

export default function SidebarSwitchs({ state }: { state: OfferFieldsState }) {
  const handleFreeOffer = (value: boolean) => {
    state.offer_is_free.value = value;
    if (value) {
      state.date_picker.value = true;
      state.hourly_select.value = true;
      state.price.value = 0;
      state.sale_price.value = 0;
      state.tax_rate.value = 0;
      state.payment_method.value = "one_time_payment";
    }
    if (
      value &&
      (state.product_type.value === "private_office" ||
        state.product_type.value === "hybrid_office")
    ) {
      state.date_picker.value = false;
      state.hourly_select.value = false;
    } else if (
      !value &&
      (state.product_type.value === "private_office" ||
        state.product_type.value === "hybrid_office")
    ) {
      state.payment_method.value = "subscription";
    }
  };
  return (
    <>
      <Observer>
        {() => (
          <>
            <Box
              sx={{
                width: "30%",
                height: "682px",
                backgroundColor: "#F7F8FA",
                display: "flex",
                flexDirection: "column",
                gap: "13px",
                pt: 3.2,
                px: 2.3,
              }}
            >
              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Publish in Orangery Landing page",
                    unchecked: "Publish in Orangery Landing page",
                  }}
                  checked={state.published.value}
                  onChange={(e) => (state.published.value = e.target.checked)}
                />
              </Box>
              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Deactivate for now",
                    unchecked: "Deactivate for now",
                  }}
                  checked={state.status.value ? true : false}
                  onChange={(e) => (state.status.value = e.target.checked)}
                />
              </Box>
              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Publish in OrangeryOS Marketplace",
                    unchecked: "Publish in OrangeryOS Marketplace",
                  }}
                  checked={state.marketplace.value}
                  onChange={(e) => (state.marketplace.value = e.target.checked)}
                />
              </Box>

              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Sell all at once",
                    unchecked: "Sell all at once",
                  }}
                  checked={state.is_wholesale.value}
                  onChange={(e) =>
                    (state.is_wholesale.value = e.target.checked)
                  }
                />
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <OrangerySwitch
                      label={{
                        checked: "Mandatory invoice payment",
                        unchecked: "Mandatory invoice payment",
                      }}
                      checked={state.force_invoice_payment.value}
                      onChange={(e) =>
                        (state.force_invoice_payment.value = e.target.checked)
                      }
                    />
                  )}
                </Observer>
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <OrangerySwitch
                      label={{
                        checked: "Auto-confirm request",
                        unchecked: "Auto-confirm request",
                      }}
                      checked={state.auto_confirm_request.value}
                      onChange={(e) =>
                        (state.auto_confirm_request.value = e.target.checked)
                      }
                    />
                  )}
                </Observer>
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <OrangerySwitch
                      label={{
                        checked: "Payable via invoice",
                        unchecked: "Payable via invoice",
                      }}
                      checked={state.payable_via_invoice.value}
                      onChange={(e) =>
                        (state.payable_via_invoice.value = e.target.checked)
                      }
                    />
                  )}
                </Observer>
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <OrangerySwitch
                      label={{
                        checked: "Create dashboard for tenant",
                        unchecked: "Create dashboard for tenant",
                      }}
                      checked={state.create_dashboard_for_tenant.value}
                      onChange={(e) =>
                        (state.create_dashboard_for_tenant.value =
                          e.target.checked)
                      }
                    />
                  )}
                </Observer>
              </Box>
              <Box>
                <Observer>
                  {() => (
                    <OrangerySwitch
                      label={{
                        checked: "Offer is free",
                        unchecked: "Offer is free",
                      }}
                      checked={state.offer_is_free.value}
                      onChange={(e) => {
                        // (state.offer_is_free.value = e.target.checked)
                        handleFreeOffer(e.target.checked);
                      }}
                    />
                  )}
                </Observer>
              </Box>
            </Box>
          </>
        )}
      </Observer>
    </>
  );
}
