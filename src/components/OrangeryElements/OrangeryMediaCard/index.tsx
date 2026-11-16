//
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState } from "react";

import DownloadIcon from "../../../assets/svg/download.svg";

// external dependencies
import { Box, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

//
import EditMediaButton from "./EditMediaButton";
import DeleteMediaButton from "./DeleteMediaButton";
import { OrangeryText } from "..";

//
import { IMedia } from "../../../queries/media";

export default function OrangeryMediaCard({
  media,
  readOnly,
  bigSize = false,
}: {
  media: IMedia;
  readOnly?: boolean;
  bigSize?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [hover, setHover] = useState(false);

  return (
    <>
      <Box
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: bigSize ? "594px" : "198px",
          borderRadius: 3,
          height: bigSize ? "450px" : "202px",
          p: 1,
          my: 3,
          transition: "0.2s",
          backgroundColor: "white",
          boxShadow: "1px 1px 8px #0000002b",
          "&:hover": {
            boxShadow: "rgb(0 0 0 / 26%) 2px 3px 17px 0px",
            transitionTimingFunction: "ease-in-out",
            backgroundColor: "#fff !important",
            transition: "0.2s",
            transitionDuration: "0.2s",
            cursor: "default",
          },
        }}
      >
        <Box
          sx={{
            "& .image": {
              width: bigSize ? "580px" : "180px",
              height: bigSize ? "357px" : "119px",
              borderRadius: 2,
              // objectFit: "cover",
              objectFit: "contain",
            },
            width: !media.is_image ? "180px" : "198px",
            height: !media.is_image ? "126px" : "202",
            overflowX: !media.is_image ? "clip" : "",
          }}
        >
          {media.is_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                bigSize
                  ? `${process.env.NEXT_PUBLIC_CDN_URL}/${media?.uuid}.jpg`
                  : media?.has_thumbnail
                  ? `${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${media?.uuid}.jpg`
                  : `${process.env.NEXT_PUBLIC_CDN_URL}/${media?.uuid}.jpg`
              }
              className="image"
              alt=""
            />
          ) : (
            <embed
              width="auto"
              height="100%"
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${media.uuid}.pdf`}
              type="application/pdf"
            />
          )}
        </Box>
        <Box>
          <Observer>
            {() => (
              <Box
                sx={{
                  mr: 2,
                  width: "100%",
                  maxWidth: "80%",
                  "& .media-name": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography fontSize={18} fontWeight={600}>
                  <OrangeryText text={media.name} limit={13} />
                </Typography>
              </Box>
            )}
          </Observer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            height: "30px",
            mb: 1,
            position: "relative",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }} color="#A5AAB4">
            {Math.trunc(media.size ?? 0 / 1024)}&nbsp;kB
          </Typography>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              display: hover ? "flex" : "none",
              // display: "flex",
              cursor: hover ? "pointer" : "default",
              gap: "3px",
            }}
          >
            {media.is_image ? (
              <IconButton
                sx={{
                  "& .icon": { width: "0.7rem", height: "0.7rem" },
                  "&.MuiIconButton-root": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                }}
                onClick={() =>
                  downloadFile(
                    `${process.env.NEXT_PUBLIC_CDN_URL}/${media.uuid}.jpg`,
                    media.name ?? "media.jpg"
                  )
                }
              >
                <DownloadIcon className="icon" />
              </IconButton>
            ) : (
              <a
                download
                href={`${process.env.NEXT_PUBLIC_CDN_URL}/${media.uuid}.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                <IconButton
                  sx={{
                    "& .icon": { width: "0.7rem", height: "0.7rem" },
                    "&.MuiIconButton-root": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                  }}
                >
                  <DownloadIcon className="icon" />
                </IconButton>
              </a>
            )}
            {!readOnly && <EditMediaButton media={media} />}
            {!readOnly && (
              <DeleteMediaButton media={media} handleCloseForm={handleClose} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

async function downloadFile(fileUrl: string, fileName: string) {
  const response = await fetch(fileUrl, {
    method: "GET",
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}
