// react & next
import React from "react";

// external dependencies
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { OrangeryCloseButton } from ".";

// icons, images & colors
import DownloadIcon from "../../assets/svg/download.svg";

export default function OrangeryDownloadContractsButton({
  documents,
}: {
  documents?: any[];
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => handleOpen()}
        // disableRipple
        sx={{
          color: "#074EE8",
          textDecoration: "none",
          display: "flex",
          alignitems: "center",
          gap: 1,
          "& .upload-icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: "#1e60e9",
          },
          // "& :hover": {
          //   backgroundColor: "transparent"
          // }
        }}
      >
        <DownloadIcon className="upload-icon" />
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Download Contracts
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": { maxWidth: 900, width: 600, msxHeight: 600 },
        }}
      >
        <DialogContent
          sx={{
            position: "relative",
            p: 0,
          }}
        >
          {open && (
            <Box
              sx={{
                pt: 1,
                pb: 4,
              }}
            >
              <OrangeryCloseButton onClose={handleClose} />
              <Observer>
                {() => (
                  <Box
                    sx={{
                      pr: 3,
                      pl: 4,
                      py: 1.8,
                      // pb: 1,
                      // pt: 2.5,
                      mb: 3.5,
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      borderBottom: (theme: any) =>
                        `1px solid ${theme.palette.grey[400]}`,
                    }}
                  >
                    <Typography
                      sx={{ flexGrow: 1, fontSize: 20, fontWeight: 800 }}
                      color={(theme) => theme.palette.primary.light}
                    >
                      Download Contracts
                    </Typography>
                  </Box>
                )}
              </Observer>

              <Observer>
                {() => (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        px: 3,
                        rowGap: 3,
                        overflowY: "auto",
                        maxHeight: 300,
                        "&::-webkit-scrollbar": {
                          width: "0.4em",
                        },
                        "&::-webkit-scrollbar-track": {
                          marginLeft: "20px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0,0,0,.1)",
                          borderRadius: 5,
                        },
                        mr: 1,
                      }}
                    >
                      {documents && documents.length > 0
                        ? documents.map((document) => {
                          return (
                            <Button
                              key={document.uuid}
                              onClick={() =>
                                window.open(
                                  `${process.env.NEXT_PUBLIC_CDN_URL}/${document.uuid}.pdf`,
                                  "_blank"
                                )
                              }
                              // disableRipple
                              sx={{
                                width: "content-fit",
                                color: "#1e60e9",
                                textDecoration: "none",
                                display: "flex",
                                alignitems: "center",
                                gap: 1,
                                "& .upload-icon": {
                                  width: "1.3rem",
                                  height: "1.3rem",
                                  color: "#1e60e9",
                                },
                                // "& :hover": {
                                //   backgroundColor: "transparent"
                                // }
                              }}
                            >
                              <DownloadIcon className="upload-icon" />
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Download {document.name}
                              </Typography>
                            </Button>
                          );
                        })
                        : <Typography
                          sx={{
                            fontSize: 14,
                            fontWieght: 500,
                            textAlign: "center",
                            width: "100%"
                          }}
                        >
                          No contracts for download.
                        </Typography>
                      }
                    </Box>
                  </>
                )}
              </Observer>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
