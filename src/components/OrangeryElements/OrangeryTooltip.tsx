// external dependencies
import { styled, tooltipClasses, TooltipProps } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const OrangeryTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "black",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#E9EFF7",
    color: "#0E0F11",
    maxWidth: 420,
    fontSize: "14px",
    fontWeight: "400",
    // border: "1px solid #dadde9",
    borderRadius: "6px",
    p: 2,
  },
}));

export default OrangeryTooltip;
