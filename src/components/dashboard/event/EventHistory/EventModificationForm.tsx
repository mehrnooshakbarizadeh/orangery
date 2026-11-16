import { Box, IconButton, Typography } from "@mui/material";
import { IEvent } from "../../../../queries/event";
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function EventModificationForm({
  event,
  handleClose,
}: {
  event: IEvent;
  handleClose: () => void;
}) {
  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 1.8,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          {/* Edit {event ? "Edit an Event" : "Create an Event"} */}
          Edit Title and Descriptions
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
      <Typography
        sx={{ fontSize: 18, fontWeight: 400, color: "#A5AAB4", mt: 2, ml: 4 }}
      >
        Current
      </Typography>
      <Typography
        sx={{ fontSize: 25, fontWeight: 700, color: "#2B2E33", mt: 2, ml: 4 }}
      ></Typography>
    </>
  );
}
