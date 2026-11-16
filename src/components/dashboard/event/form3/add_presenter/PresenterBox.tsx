import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { useEmployees } from "../../../../../queries/employee";
import { EventFieldsState } from "../../EventForm";
import { OrganizerEventFieldsState } from "../../organizer/organizer-preview/OrganizerReviewPage";

export const PresenterBox = observer(
  ({
    presenter,
    values,
    state,
  }: {
    presenter: string;
    values: string[];
    state: EventFieldsState | OrganizerEventFieldsState;
  }) => {
    const globalState = useGlobalState();
    const { data: employees } = useEmployees(globalState.office_uuid);

    const presenter_name =
      employees?.filter((e) => e.uuid === presenter).map((p) => p.name) || "";

    const presenter_email =
      employees?.filter((e) => e.uuid === presenter).map((p) => p.email) || "";

    const handleRemove = (value: string) => {
      const i = state.presenter_uuids.values.findIndex(
        (v) => v.value === value
      );
      console.log(i);
      if (i !== -1) {
        state.presenter_uuids.deleteElementValue(i);
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
            {presenter_name}
          </Typography>
          <Typography fontSize={14} fontWeight={400} color="#A5AAB4">
            {presenter_email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => handleRemove(presenter)}
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
