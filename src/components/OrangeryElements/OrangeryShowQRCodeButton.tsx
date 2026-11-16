// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
import { useState } from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
  IconButton,
  DialogContent,
  Dialog,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

// icons, images & colors
import CrossIcon from "../../assets/svg/cross.svg";
import DownloadIcon from "../../assets/svg/download.svg";
import OrangeryLogo from "./OrangeryLogo";
import QrCodeIcon from "@mui/icons-material/QrCode";

export default function OrangeryShowQRCodeButton({
  uuid,
  assetType,
  sx,
  name,
}: {
  uuid?: string;
  assetType: string;
  sx?: any;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const globalState = useGlobalState();
  const office = globalState.currentOffice;
  const qrCodeValue = `orangeryos://${assetType}/${uuid}`;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadQRCode = () => {
    // Generate download with use canvas and stream
    // for adding the name, created two canvas and combined it (one canvas is qr and other one is the name)
    const canvas = document.getElementById("qr-gen") as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png");
    let size = 580;
    let img = document.createElement("img");
    img.src = pngUrl;
    img.onload = function () {
      let th: any = this;
      let nameCanvas = document.createElement("canvas");
      nameCanvas.width = size;
      nameCanvas.height = size;
      const ctx = nameCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(th, 0, 0, size, size);
        ctx.font = "18px Assistant";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(`Name: ${name}`, Math.floor(size / 2), 28);
      }
      const pngUrl2 = nameCanvas.toDataURL("image/png");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl2;
      downloadLink.download = `${name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          ...sx,
        }}
      >
        <QrCodeIcon color={"primary"} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { maxWidth: 600, width: 600 } }}
      >
        <DialogContent id={"dialog"} sx={{ p: 0 }}>
          <style>
            {`
            @page {
              size: A5;
            }
            @media print 
            {
            html, body {
              width: 148mm;
              height: 210mm;
            }
            #bodyBox{
              position:absolute;
              top:200px;
              left:25%;
            }
            #qrBox{
              display:none;
              position:absolute;
              top:50%;
              left:50%;
            }
            #crossIcon,
            #title,
            #button1,
            #button2,
            #downloadButton{display: none;}
            #scanMe,#orangeryLogo,#name{display:block}
            }`}
          </style>
          {open && (
            <Box id={"bodyBox"}>
              <Box
                id={"qrBox"}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  py: 2,
                  px: 4,
                  "& .form-title": { flexGrow: 1 },
                  "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
                }}
              >
                <Typography id={"title"} variant="h2" className="form-title">
                  QR Code
                </Typography>
                <IconButton id={"crossIcon"} onClick={handleClose}>
                  <CrossIcon className="cancel-icon" />
                </IconButton>
              </Box>
              <Box
                id={"orangeryLogo"}
                sx={{ textAlign: "center", display: "none" }}
              >
                <OrangeryLogo />
              </Box>
              <Typography
                id={"name"}
                variant={"h3"}
                component="div"
                sx={{ textAlign: "center", mt: 3, display: "none" }}
              >
                Name:{" "}
                <Box fontWeight="700" display="inline">
                  {name}
                </Box>{" "}
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  // component="img"

                  sx={{
                    height: 300,
                    width: 300,
                    maxHeight: 300,
                    maxWidth: 300,
                    border: "1px solid grey",
                  }}
                  // alt="The house from the offer."
                  // src={`${process.env.NEXT_PUBLIC_CDN_URL}/${office?.qr_code}.jpg`}
                >
                  <QRCodeCanvas
                    id="qr-gen"
                    value={qrCodeValue}
                    size={290}
                    level={"H"}
                    includeMargin={true}
                    imageSettings={{
                      src: `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/Orangery-OS.png`,
                      height: 18,
                      width: 105,
                      excavate: true,
                    }}
                  />
                </Box>
              </Box>

              <Typography
                id={"scanMe"}
                variant={"h2"}
                sx={{ textAlign: "center", mt: 3, display: "none" }}
              >
                Scan me
              </Typography>
              <Button
                id={"downloadButton"}
                onClick={handleDownloadQRCode}
                sx={{
                  mx: "auto",
                  mt: 3,
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
                  Download the QR
                </Typography>
              </Button>
              <Box
                sx={{
                  mt: 3,
                  mb: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  id="button1"
                  variant="outlined"
                  sx={{ fontSize: 20, px: 4, py: 2, width: 200 }}
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  id="button2"
                  onClick={() => window.print()}
                  variant="contained"
                  sx={{ fontSize: 20, px: 4, py: 2, width: 200 }}
                >
                  Print Code
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
