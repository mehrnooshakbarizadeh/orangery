// external dependencies
import { IconButton } from "@mui/material";

// icons, images & colors
import CloseIcon from "@mui/icons-material/Close";

function OrangeryCloseButton({
  onClose,
  white,
  noAbsolute,
  sx,
}: {
  onClose: () => void;
  white?: boolean;
  noAbsolute?: boolean;
  sx?: any;
}) {
  return (
    <IconButton
      sx={{
        ...sx,
        display: "flex",
        // width: "36px",
        // height: "36px",
        color: "black",
        ...(!noAbsolute
          ? {
              position: "absolute",
              right: 12,
              top: 12,
            }
          : {
              ml: "auto",
            }),
        ...(white
          ? {
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#e3e3e3" },
            }
          : {}),
        // borderRadius: "5px",
      }}
      onClick={onClose}
    >
      <CloseIcon />
    </IconButton>
  );
}

export default OrangeryCloseButton;
