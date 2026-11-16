// react & next
import React from "react";

// external dependencies
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button
} from "@mui/material";

// orangery elements & internal dependencies
import OrangeryCloseButton from "./OrangeryCloseButton";

// queries & backend
//

// icons, images & colors
import EditPenIcon from "../../assets/svg/editPen.svg";
import RemoveIcon from "../../assets/svg/remove.svg";
import AddIcon from "@mui/icons-material/Add";

export default function OrangeryFormButton({
  Form,
  variant: outerVariant,
  darkMode,
  caption: outerCaption,
  size,
  noIcon,
  disabled = false,
  hoverColor
}: {
  // Form: new () => React.Component<any, any>;
  Form: React.ReactElement;
  variant: string;
  darkMode?: boolean;
  caption?: string | boolean;
  size?: string;
  noIcon?: boolean;
  disabled?: boolean;
  hoverColor?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let icon = <></>;
  let caption = "";
  let color = "";
  let variant = "text" as "text" | "outlined" | "contained" | undefined; ////////!!!!!!!! type!?

  let height = "unset" as string | number;
  let width = "unset" as string | number;

  switch (outerVariant) {
    case "remove":
      icon = <RemoveIcon className="icon" />;
      caption = outerCaption
        ? typeof outerCaption === "string"
          ? outerCaption
          : "Remove"
        : "";
      color = "red";
      break;

    case "edit":
      icon = <EditPenIcon className="icon" />;
      caption = outerCaption
        ? typeof outerCaption === "string"
          ? outerCaption
          : "Edit"
        : "";
      color = "primary.main";
      break;

    case "add":
      variant = "contained";
      icon = <AddIcon sx={{ marginLeft: "-10px" }} />; // 
      caption = outerCaption
        ? typeof outerCaption === "string"
          ? outerCaption
          : "Add"
        : "";
      color = "white";
      break;

    default:
  }

  switch (size) {
    case "medium":
      height = 51
      width = 179
      break;

    case "large":
      height = 55
      width = 179
      break;

    case "full":
      height = 51
      width = "100%"
      break;

    default:
      height = "unset"
      width = "unset"
  }


  // <Button
  //   variant="contained"
  //   color="primary"
  //   onClick={() => handleOpen()}
  //   sx={{
  //     "& .add-btn": { fontSize: 18, fontWeight: 400, color: "#fff" },
  //     px: 5,
  //     py: 1.5,
  //     gap: "10px",
  //     // height: 55,
  //     width: 179,
  //   }}
  // >

  //   <Typography className="add-btn">Add Area</Typography>
  // </Button>

  return (
    <>
      {darkMode
        ? <IconButton
          onClick={handleOpen}
          sx={{
            "& .icon": {
              width: "0.7rem",
              height: "0.7rem"
            },
            "&.MuiIconButton-root": {
              backgroundColor: "#000",
              color: "#fff",
            },
            ...(hoverColor
              ? {
                "&:hover": {
                  backgroundColor: hoverColor
                }
              }
              : {}
            )
          }}
          disabled={disabled}
        >
          {icon}
        </IconButton>
        : caption
          ? <Button
            variant={variant}
            aria-label={variant}
            onClick={handleOpen}
            sx={{
              color: color,
              gap: 1,
              width: width,
              height: height,
              "& .icon": {
                width: "1.3rem",
                height: "1.3rem",
                color: color,
              },
              ...(hoverColor
                ? {
                  "&:hover": {
                    backgroundColor: hoverColor
                  }
                }
                : {}
              )
            }}
            disabled={disabled}
          >
            {!noIcon && icon}
            <Typography variant="h5">{caption}</Typography>
          </Button>
          : <IconButton
            onClick={() => handleOpen()}
            sx={{
              // "& > *:first-of-type": { mx: 0 },
              "& .icon": {
                width: "1.3rem",
                height: "1.3rem",
                color: color,
              },
              "& .MuiButton-root": { minWidth: 40 },
              ...(hoverColor
                ? {
                  "&:hover": {
                    backgroundColor: hoverColor
                  }
                }
                : {}
              )
            }}
            disabled={disabled}
          >
            {icon}
          </IconButton>
      }

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            // width: 1263,
            // minWidth: 1263,
            // height: 488,
            // backgroundColor: "white",
            borderRadius: 4,
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            overflowX: "hidden"
          }}>
          {open &&
            <>
              {React.cloneElement(Form, { handleClose })}
            </>
          }
        </DialogContent>
      </Dialog>
    </>
  );
}