import { Box, Button, Typography } from "@mui/material";
import { Observer, observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { useAllCoworker } from "../../../../../queries/coworker";
import { useEmployees } from "../../../../../queries/employee";
import { EventFieldsState } from "../../EventForm";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export const AttendeeBox = observer(
  ({
    attendee,
    values,
    state,
  }: {
    attendee: string;
    values: string[];
    state: EventFieldsState | OrganizerEventFieldsState;
  }) => {
    const globalState = useGlobalState();
    const { data: employees } = useAllCoworker(globalState.office_uuid);

    const attendee_object = employees?.filter((e) => e.uuid === attendee) || [];

    const attendee_email =
      employees?.filter((e) => e.uuid === attendee).map((p) => p.email) || "";

    const handleRemove = (value: string) => {
      const i = state.attendee_uuids.values.findIndex((v) => v.value === value);
      console.log(i);
      if (i !== -1) {
        state.attendee_uuids.deleteElementValue(i);
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          backgroundColor: "#F9F9FA",
          borderRadius: 1,
          width: "100%",
          p: 1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1.3 }}
        >
          <Typography fontSize={16} fontWeight={600} color="#2B2E33">
            <Observer>
              {() => <>{attendee_object.map((a) => a.name)}</>}
            </Observer>
          </Typography>
          <Typography fontSize={14} fontWeight={400} color="#A5AAB4">
            {attendee_object.map((a) => a.email)}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => handleRemove(attendee)}
          sx={{
            color: "red",
            border: "1px solid red",
            "&.MuiButton-root": { py: "1px" },
          }}
        >
          Remove
        </Button>
      </Box>
    );
  }
);
