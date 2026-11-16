// 
//

// react & next
import React, { useEffect, useState } from "react";

// external dependencies
import {
  Typography,
} from "@mui/material";
import Countdown from "react-countdown";

// orangery elements & internal dependencies
//

// queries & backend
//

// icons, images & colors
//

export default function OrangeryCountDown({
  seconds = 0,
  callBack
}: {
  seconds?: number;
  callBack?: () => void
}) {
  const [timerStarted, setTimerStarted] = useState(true);
  const [timerEnded, setTimerEnded] = useState(false);

  // useEffect(() => {
  //   if (!timerStarted)
  //     setTimerStarted(true);
  // }, [timerStarted])

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      setTimerEnded(true);
      callBack?.();
      // Render a completed state
      return <></>;
    } else {
      // Render a countdown
      return (
        <Typography
          sx={{
            color: (theme) => theme.palette.primary.main,
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          {hours != 0 ? `${hours}:` : ""}{minutes}:{seconds}
        </Typography>
      );
    }
  };

  const [now, setNow] = useState(Date.now())

  async function reset() {
    setNow(Date.now());
  }

  return (
    timerStarted && !timerEnded
      ? <Countdown date={now + seconds * 1000} renderer={renderer} />
      : <Typography
        sx={{
          color: (theme) => theme.palette.primary.main,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        0:0
      </Typography>
  );
}