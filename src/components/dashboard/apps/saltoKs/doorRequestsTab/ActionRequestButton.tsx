import { Box, Button } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { DoorRequestState } from ".";
import {
  IDoorRequest,
  usePutDoorRequest,
} from "../../../../../queries/doorRequest";
import { OrangeryToast } from "../../../../OrangeryElements";

export default function ActionRequestButton({
  doorRequest,
  doorRequestState,
  isAccepted,
}: {
  doorRequest: IDoorRequest;
  doorRequestState: DoorRequestState;
  isAccepted: boolean;
}) {
  const mutation = usePutDoorRequest();

  const handleAcceptDoorRequest = (id: string) => {
    if (id) {
      handleSubmit(id, "accepted");
      OrangeryToast(`Successfully accepted`, "success");
    }
  };

  const handleRejectDoorRequest = (id: string) => {
    if (id) {
      handleSubmit(id, "denied");
      OrangeryToast(`Successfully denied`, "success");
    }
  };

  async function handleSubmit(id: string | "", status: string) {
    try {
      await mutation.mutateAsync({
        door_request_uuids: [],
        door_request_uuid: id,
        status: status,
      });
    } catch (err: any) {
      // state.setupErrors(err);
    }
  }

  return (
    <>
      <Observer>
        {() => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Button
              onClick={() => handleRejectDoorRequest(doorRequest.uuid)}
              variant="outlined"
              sx={{
                width: "95px",
                backgroundColor: "#fff",
                color: "#505357",
                border: "1px solid #9A9CA0",
                fontSize: 14,
                fontWeight: 500,
                px: 3,
                "&.MuiButton-root:hover": {
                  backgroundColor: "#fff",
                  border: "1px solid #9A9CA0",
                },
              }}
            >
              Declined
            </Button>
            <Button
              onClick={() => handleAcceptDoorRequest(doorRequest.uuid)}
              variant="outlined"
              sx={{
                width: "95px",
                backgroundColor: "#fff",
                color: "#505357",
                border: "1px solid #9A9CA0",
                fontSize: 14,
                fontWeight: 500,
                px: 3,
                "&.MuiButton-root:hover": {
                  backgroundColor: "#fff",
                  border: "1px solid #9A9CA0",
                },
              }}
            >
              Accept
            </Button>
          </Box>
        )}
      </Observer>
    </>
  );
}
