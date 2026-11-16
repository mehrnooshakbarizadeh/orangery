import { Typography } from "@mui/material";
import { IPerson } from "../../../../queries/event";

export default function DeclinedValues({
  decValues,
}: {
  decValues: IPerson[];
}) {
  return (
    <>
      {decValues.map((req) => (
        <Typography
          key={req.uuid}
          fontSize={18}
          fontWeight={400}
          color="#FF3D00"
        >
          Declined&nbsp;&nbsp;{`"${req.name}",`}
        </Typography>
      ))}
    </>
  );
}
