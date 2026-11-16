// external dependencies
import { Box, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import OrangeryTooltip from "./OrangeryTooltip";
export default function OrangeryText({
  sx,
  text,
  limit,
}: {
  text?: string;
  limit: number;
  sx?: any;
}) {
  return (
    <>
      {text && text.length > limit ? (
        <Box sx={{ wordBreak: "break-word" }}>
          <OrangeryTooltip
            title={text}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
          >
            <span>{text?.slice(0, limit) + " ..."}</span>
          </OrangeryTooltip>
        </Box>
      ) : (
        <Box sx={{ ...sx }}>{text}</Box>
      )}
    </>
  );
}
