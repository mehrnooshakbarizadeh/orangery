// react & next
//

// external dependencies
import {
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
//

// queries & backend
//

// icons, images & colors
//

export default function OrangeryDateTime({
  dateTime,
}: {
  dateTime: string
}) {
  let thisDateTime = new Date(dateTime)
  let fullDate = thisDateTime.getUTCFullYear() + "-" + (thisDateTime.getUTCMonth() + 1) + "-" + thisDateTime.getUTCDate()

  let nowDateTime = new Date()
  let nowFullDate = nowDateTime.getUTCFullYear() + "-" + (nowDateTime.getUTCMonth() + 1) + "-" + nowDateTime.getUTCDate()

  let prettyDateTime = (fullDate === nowFullDate
    ? (new Date(dateTime)).toLocaleString("de-DE", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
    : (new Date(dateTime)).toLocaleString("de-DE", {
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }))

  // <Typography
  //   variant="CAPTION"
  // >
  return (<>
    {prettyDateTime}
  </>
  );
}
