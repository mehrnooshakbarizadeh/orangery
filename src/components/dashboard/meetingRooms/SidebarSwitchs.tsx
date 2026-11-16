import { Box } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { IMeetingRoom } from "../../../queries/meetingRoom";
import { OrangerySwitch } from "../../OrangeryElements";
import { MeetingRoomState } from "./HandleRoomForm";

export default function SidebarSwitchs({
  state,
  meetingRoom,
}: {
  state: MeetingRoomState;
  meetingRoom?: IMeetingRoom;
}) {
  return (
    <>
      <Observer>
        {() => (
          <>
            {!meetingRoom?.tenant_office_uuid && (
              <Box
                sx={{
                  width: "550px",
                  height: "776px",
                  backgroundColor: "#F7F8FA",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <OrangerySwitch
                  label={{
                    checked: "Ready to use",
                    unchecked: "Ready to use",
                  }}
                  checked={state.active.value}
                  onChange={(e) => (state.active.value = e.target.checked)}
                />
                <OrangerySwitch
                  label={{
                    checked: "Pay via invoice",
                    unchecked: "Pay via invoice",
                  }}
                  checked={state.payable_via_invoice.value}
                  onChange={(e) =>
                    (state.payable_via_invoice.value = e.target.checked)
                  }
                />
              </Box>
            )}
          </>
        )}
      </Observer>
    </>
  );
}
