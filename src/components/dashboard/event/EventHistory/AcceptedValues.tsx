import { Typography } from "@mui/material";
import { IPerson } from "../../../../queries/event";

export default function AcceptedValues({
  accValues,
}: {
  accValues: IPerson[];
}) {
  return (
    <>
      {accValues.map((req) => (
        <Typography
          key={req.uuid}
          fontSize={18}
          fontWeight={400}
          color="#42B863"
        >
          Accepted&nbsp;&nbsp;{`"${req.name}",`}
        </Typography>
      ))}
    </>
  );
}
