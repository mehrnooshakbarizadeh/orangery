import { IconButton } from "@mui/material";
import { useState } from "react";
import EyeIcon from "../../../../assets/svg/eye-new.svg";
import NextLink from "next/link";
import { Link as MUILink } from "@mui/material";
import { IEvent } from "../../../../queries/event";

export default function EventHistoryButton({ event }: { event: IEvent }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NextLink href={`/dashboard/event-hisotry?id=${event.uuid}`} passHref>
        <MUILink
          // target="_blank"
          sx={{
            textDecoration: "none",
          }}
        >
          {/* <Item item={item} selected={selected} animateOnHover showSelectedBar /> */}
          <IconButton
            sx={{ "& .eye-icon": { width: "1.1rem", height: "1.1rem" } }}
            onClick={handleOpen}
          >
            <EyeIcon className="eye-icon" />
          </IconButton>
        </MUILink>
      </NextLink>
    </>
  );
}
