// react & next
import React from "react";

// external dependencies
import {
  Button
} from "@mui/material";

// orangery elements & internal dependencies
// import DeskForm from "./DeskForm";

// queries & backend
//

// icons, images & colors
//

export default function OrangeryButton({
  variant: outerVariant,
  onClick,
  caption: outerCaption,
  disabled,
}: {
  variant: string;
  onClick?: (e?: React.FormEvent) => void;
  caption?: string | JSX.Element;
  disabled?: boolean;
}) {
  function handleClick(e?: React.FormEvent) {
    if (onClick)
      onClick(e)
  }

  let caption = outerCaption as any;
  let color = "" as any;
  let backgroundColor = "" as any;
  let variant = "text" as "text" | "outlined" | "contained" | undefined;  ////////!!!!!!!! type!?
  let type = "button" as "button" | "submit" | "reset" | undefined;       ////////!!!!!!!! type!?

  switch (outerVariant) {
    case "outlined":
      color = "#2B2E33";
      backgroundColor = "white";
      // border = "1px solid #2B2E33";
      variant = outerVariant;
      type = "button";

      break;

    case "cancel":
      caption = "Cancel";
      color = "#000";
      // backgroundColor = (theme: any) => theme.palette.grey[200];
      type = "button";

      break;

    case "submit":
      variant = "contained";
      caption = caption ? caption : "ok";
      color = "#fff";
      type = "submit";
      onClick = undefined; // force onClick for type=submit to be undefined
      // backgroundColor = (theme: any) => theme.palette.grey[200];

      break;

    default:
  }

  return (
    <Button
      variant={variant}
      type={type}
      // color="primary"

      disabled={disabled}

      onClick={handleClick}
      sx={{
        width: 170,
        height: 55,
        fontSize: 20,
        color: color,
        backgroundColor: backgroundColor,
      }}
    >
      {caption}
    </Button>
  );
}