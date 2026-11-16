import { Typography } from "@mui/material";
import { IPerson } from "../../../../queries/event";

export default function RequestedValues({ requests }: { requests: IPerson[] }) {
  return (
    <>
      {requests.map((req) => (
        <Typography key={req.uuid}>
          Add&nbsp;&nbsp;{`"${req.name}",`}
        </Typography>
      ))}
    </>
  );
}
