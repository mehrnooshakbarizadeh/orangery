import { Box, Button, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryTextField } from "../../../../OrangeryElements";
import { EventFieldsState, OrganizerState } from "../../EventForm";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export default function OrganizerRow({
  state,
  organizer,
}: {
  state: EventFieldsState | OrganizerEventFieldsState;
  organizer: OrganizerState;
}) {
  const handleDrop = () => {
    const index = state.organizer_uuids.values.findIndex(
      (v) => v.value === organizer
    );
    state.organizer_uuids.deleteElementValue(index);
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexBasis: "100%",
            justifyContent: "end",
            backgroundColor: "#F9F9FA",
            borderRadius: 1,
            p: "14px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: 1.3,
            }}
          >
            <Observer>
              {() => (
                <>
                  <Typography fontSize={16} fontWeight={600} color="#2B2E33">
                    {organizer.name?.value}
                  </Typography>
                  <Typography fontSize={14} fontWeight={400} color="#A5AAB4">
                    {organizer.email?.value}
                  </Typography>
                </>
              )}
            </Observer>
          </Box>
          <Button
            variant="outlined"
            onClick={handleDrop}
            sx={{
              color: "red",
              border: "1px solid red",
              "&.MuiButton-root": { py: "1px" },
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </>
  );
}
