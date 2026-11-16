// react & next
import Head from "next/head";
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
//

// icons, images & colors
//

export default function MeetingRoomsWidgetPreviewButton({
  officeName,
  officeUuid,
  color,
  caption
}: {
  officeName: string;
  officeUuid: string;
  color: string;
  caption: string;
}) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setCount(count + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, caption]);

  return (
    <>
      <Box
        key={count + color + caption}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          ml: 3,
          mr: "auto"
        }}
      >
        <Typography>
          preview:
        </Typography>

        <Box
          sx={{
            minWidth: 176,
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div
            key={count + color + caption}
            id="orangery-meeting-room-widget"
            data-office={officeName}
            data-token={officeUuid}
            data-color={color}
            data-caption={caption}
            data-sample="true"
            className="orangery-meeting-room-widget"
            style={{
              width: "100%",
              margin: "auto"
            }}
          >
            loading...
          </div>
        </Box>
      </Box>

      <Head>
        <script async src={`${process.env.NEXT_PUBLIC_ORANGERY_LANDING_URL}/meeting-room-link-widget/${process.env.NEXT_PUBLIC_ENV_SLUG}/index.min.js?1${count}`}></script>
      </Head>
    </>
  );
}
