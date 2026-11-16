import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  IEvent,
  IOrganizerEvent,
  usePatchEvent,
  usePostEventModification,
} from "../../../../../../queries/event";
import { Observer } from "mobx-react-lite";
import ArrowRightIcon from "../../../../../../assets/svg/arrow-right.svg";
import {
  OrangeryTextAreaField,
  OrangeryTextField,
  OrangeryToast,
} from "../../../../../OrangeryElements";
import CrossIcon from "../../../../../../assets/svg/cross.svg";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import WeeklyRepeat from "../../../WeeklyReport";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";
import { useGlobalState } from "../../../../../../Contexts & Globals/GlobalContext";

export default function EditForm({
  handleClose,
  event,
  state,
}: {
  handleClose: () => void;
  event: IOrganizerEvent;
  state: OrganizerEventFieldsState;
}) {
  const mutation = usePostEventModification();
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updateData = {
        uuid: event.uuid,
        office_uuid: globalState.office_uuid,
        location: state.data.location,
        event_link: state.data.event_link,
      };
      const result = await mutation.mutateAsync(updateData);
      state.setResultAddress(result);
      handleClose();
      if (event) {
        OrangeryToast("Successfully edited " + state.data.name, "success");
      } else {
        OrangeryToast("Successfully created " + state.data.name, "success");
      }
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 3.5,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Location
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pl: 4,
        }}
      >
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" mt={4}>
          Current
        </Typography>
        <Typography fontSize={22} fontWeight={700} color="#2B2E33">
          {event.location ? event.location : "-"}
        </Typography>
      </Box>
      <Divider sx={{ mt: 5, mb: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
          Your Suggestion
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 3 }}>
          <Observer>
            {() => (
              <OrangeryTextField
                label="LOCATION ADDRESS"
                name="location"
                placeholder="Enter location address"
                error={!!state.location.error}
                value={state.location.value}
                helperText={state.location.error}
                onChange={(e: any) => (state.location.value = e.target.value)}
              />
            )}
          </Observer>
          <Observer>
            {() => (
              <OrangeryTextField
                label="EVENT URL(FOR ONLINE EVENTS)"
                name="link"
                placeholder="Enter event url"
                error={!!state.event_link.error}
                value={state.event_link.value}
                helperText={state.event_link.error}
                onChange={(e: any) => (state.event_link.value = e.target.value)}
              />
            )}
          </Observer>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          pt: 2,
          borderTop: "1px solid #EDEEF0",
          display: "flex",
          gap: 2,
          pr: 2,
          position: "absolute",
          right: 0,
          bottom: "16px",
          justifyContent: "end",
          "& .add-btn": { width: "1.3rem", height: "1.3rem" },
        }}
      >
        <Button
          variant="text"
          onClick={handleClose}
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 5,
          }}
        >
          <Typography
            color="#2B2E33"
            sx={{
              "&.MuiTypography-root": {
                fontSize: "21px",
                fontWeight: 600,
              },
            }}
          >
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            display: "flex",
            gap: 2,
            mr: 1,
            py: "12px",
            px: 3,
            "& .submit": {
              fontSize: "21px",
              fontWeight: 600,
            },
          }}
          color="primary"
          variant="contained"
          disabled={mutation.isLoading}
        >
          <Typography className="submit">Send Request</Typography>
        </Button>
      </Box>
    </>
  );
}
