import { Box, Typography } from "@mui/material";
import {
  IAttendee,
  IOrganizer,
  IPerson,
  IPresenter,
} from "../../../../queries/event";

export default function OrganizerInfo({
  person,
}: {
  person: IOrganizer | IAttendee | IPresenter | IPerson;
}) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {person.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {person.email}
        </Typography>
      </Box>
    </>
  );
}
