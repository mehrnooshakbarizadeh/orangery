import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangerySwitch } from "../../OrangeryElements";
import { EventFieldsState } from "./EventForm";

export default function SidebarSwitchs({ state }: { state: EventFieldsState }) {
  return (
    <>
      <Observer>
        {() => (
          <>
            <Box
              sx={{
                width: "379px",
                height: "91.2%",
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
                    checked: "Ready to use",
                    unchecked: "Ready to use",
                  }}
                  checked={state.active.value ? true : false}
                  onChange={(e) => (state.active.value = e.target.checked)}
                />
              </Box>

              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Show in the mobile app",
                    unchecked: "Show in the mobile app",
                  }}
                  checked={state.mobile_view.value}
                  onChange={(e) => {
                    state.mobile_view.value = e.target.checked;
                  }}
                />
              </Box>

              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Show in the Orangery.io",
                    unchecked: "Show in the Orangery.io",
                  }}
                  checked={state.website_view.value}
                  onChange={(e) => {
                    state.website_view.value = e.target.checked;
                  }}
                />
              </Box>

              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Free Event",
                    unchecked: "Free Event",
                  }}
                  checked={state.is_free.value}
                  onChange={(e) => {
                    state.is_free.value = e.target.checked;
                    if (e.target.checked) {
                      state.price.value = 0;
                      state.attendee_price.value = 0;
                    }
                  }}
                />
              </Box>

              <Box>
                <OrangerySwitch
                  label={{
                    checked: "Pay via invoice",
                    unchecked: "Pay via invoice",
                  }}
                  checked={state.pay_via_invoice.value}
                  onChange={(e) => {
                    state.pay_via_invoice.value = e.target.checked;
                  }}
                />
              </Box>
            </Box>
          </>
        )}
      </Observer>
    </>
  );
}
