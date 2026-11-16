// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  DialogTitle,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

// icons, images & colors
import UploadIcon from "../../assets/svg/upload.svg";
import MemoIcon from "../../assets/svg/memo.svg";
import CancleIcon from "../../assets/svg/cancle.svg";

export default function OrangeryFileFieldPDF({
  value,
  label,
  onChange,
}: {
  value: File | string;
  label: string;
  onChange: (value: File | null) => void;
}) {
  const handleSelect = (file: File) => {
    onChange(file);
  };
  const handleDelete = () => {
    onChange(null);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
          borderRadius: 1.5,
          // mt: 2.9,
          height: 58,
          px: 1.6,
          // gap: 1,
          border: (theme) => `1px dotted ${theme.palette.info.main}`,
          cursor: "pointer",
          "& .icon svg": {
            width: "1.5rem",
            height: "1.5rem",
            flexShrink: 0,
            color: "info.main",
            "&.selecting": { color: "grey.A200" },
          },
          "& .inner-container": {
            flexGrow: 1,
            overflow: "hidden",
          },
          "& .container-action": {
            flexShrink: 0,
          },
        }}
      >
        <Box
          sx={{
            zIndex: 9999,
            mt: "-10px",
            "& .file-header": {
              backgroundColor: "#fff",
              fontSize: 12,
              color: "#374C6B",
              // pb: 1,
            },
          }}
        >
          <Typography className="file-header">{label}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton className="icon">
            <UploadIcon className={`${value ? "selecting" : ""}`} />
          </IconButton>
          <div className="inner-container">
            {value && <FileView file={value} />}
            {!value && <FileSelect onSelect={handleSelect} />}
          </div>
          <div className="container-action">
            {value && (
              <IconButton onClick={handleDelete}>
                <Box sx={{ width: "1rem", height: "1rem" }}>
                  <CancleIcon className="cancle-icon" />
                </Box>
              </IconButton>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
}

function FileView({ file }: { file: File | string }) {
  return (
    <Box
      sx={{
        display: "flex",
        // width: "110%",
        alignItems: "center",
        justifyContent: "start",
        "& .image": {
          width: "2rem",
          height: "2rem",
        },
        "& .cancel-icon": {
          width: "1rem",
          height: "1rem",
        },
      }}
    >
      {file instanceof File && <ShowImageFile file={file} />}
      {typeof file === "string" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${file}.jpg`}
          className="image"
          alt=""
        />
      )}
    </Box>
  );
}

function fileToUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve("");
        }
      },
      false
    );

    reader.readAsDataURL(file);
  });
}

function ShowImageFile({ file }: { file: File }) {
  const [url, setUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleHide = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    (async () => {
      const url = await fileToUrl(file);
      setUrl(url);
    })();
  }, [file, setUrl]);

  return (
    <>
      {url && (
        <Box
          sx={{
            "& .pdf-icon": { width: "1rem", height: "1rem", color: "##6c6c6c" },
          }}
        >
          <Button onClick={handleView}>
            <MemoIcon className="pdf-icon" />
            <Typography>&nbsp;file uploaded</Typography>
            {/* <img src={url} /> */}
          </Button>
          <Dialog
            open={open}
            fullWidth
            maxWidth="xl"
            onClose={handleHide}
            sx={{
              "& .MuiDialogContent-root": {
                height: "80vh",
              },
            }}
          >
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "& .cancle-icon": { width: "1.3rem", height: "1.3rem" },
                }}
              >
                <Typography variant="h4">Asset Image</Typography>
                <IconButton onClick={handleHide} size="large">
                  <CancleIcon className="cancle-icon" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent
              sx={{
                width: "100%",
                height: "98%",
                "& iframe": {
                  width: "100%",
                  height: "98%",
                },
              }}
            >
              <iframe title="Asset Invoice" src={url} />
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </>
  );
}

function FileSelect({ onSelect }: { onSelect: (file: File) => void }) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onSelect(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".png, .pdf, .jpg, .jpeg",
    maxFiles: 1,
    maxSize: 10000000,
    multiple: false,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "grey.A200" }}>
          Drop your files here ...
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: "grey.A200",
            "& .browse": {
              color: (theme) => theme.palette.info.main,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "underline",
            },
          }}
        >
          Drag &#38; Drop or &nbsp;
          <span className="browse">Browse</span>
        </Typography>
      )}
    </div>
  );
}
