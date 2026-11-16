import { useState } from "react";
import { IEvent, IOrganizerEvent } from "../../../../../queries/event";
import NextLink from "next/link";
import { Button, IconButton, Link as MUILink } from "@mui/material";
import EyeIcon from "../../../../assets/svg/eye-new.svg";

export default function OrganizerReviewButton({
  event,
}: {
  event: IOrganizerEvent;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <NextLink href={`/dashboard/organizer-preview?id=${event.uuid}`} passHref>
        <MUILink
          // target="_blank"
          sx={{
            textDecoration: "none",
          }}
        >
          {/* <Item item={item} selected={selected} animateOnHover showSelectedBar /> */}
          <Button
            variant="outlined"
            sx={{ "& .eye-icon": { width: "1.1rem", height: "1.1rem" } }}
            onClick={handleOpen}
          >
            Review
          </Button>
        </MUILink>
      </NextLink>
    </>
  );
}
