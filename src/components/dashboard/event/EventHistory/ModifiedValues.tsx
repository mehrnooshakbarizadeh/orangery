import { Typography } from "@mui/material";
import { IPerson } from "../../../../queries/event";

export default function ModifiedValues({
  modifiedReqs,
}: {
  modifiedReqs: IPerson[] | null;
}) {
  // console.log(request);
  return (
    <>
      {modifiedReqs?.map((mReq) => {
        return (
          <>
            {mReq.status === "accepted" && (
              <Typography fontSize={18} fontWeight={400} color="#42B863">
                Accepted&nbsp;&nbsp;{`"${mReq.name}",`}
              </Typography>
            )}
            {mReq.status === "declined" && (
              <Typography fontSize={18} fontWeight={400} color="#FF3D00">
                Declined&nbsp;&nbsp;{`"${mReq.name}",`}
              </Typography>
            )}
          </>
        );
      })}
    </>
  );
}
