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
import AddFileIcon from "../../assets/svg/addFile.svg";
import CancleIcon from "../../assets/svg/cancle.svg";
import { format } from "date-fns";

export default function OrangeryCSV({
  value,
  label,
  onChange,
}: {
  value: File | string;
  label?: string;
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          borderRadius: 1.5,
          // mt: 2.9,
          height: 184,
          px: 1.6,
          // gap: 1,
          border: "1px dotted #074EE8",
          cursor: "pointer",
          "& .icon svg": {
            width: "2.87rem",
            height: "2.56rem",
            flexShrink: 0,
            color: "info.main",
            "&.selecting": { color: "grey.A200" },
          },
          "& .container-action": {
            flexShrink: 0,
          },
        }}
      >
        <FileSelect onSelect={handleSelect} />
      </Box>
      {value && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#E4F5E9",
            p: 1,
            borderRadius: 1.25,
            mt: 2,
          }}
        >
          <FileView file={value} />
          <div className="container-action">
            <IconButton
              onClick={handleDelete}
              sx={{
                "& .cancle-icon": {
                  width: "0.56rem",
                  height: "0.56rem",
                  color: "#2B2E33",
                },
              }}
            >
              <CancleIcon className="cancle-icon" />
            </IconButton>
          </div>
        </Box>
      )}
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

  React.useEffect(() => {
    (async () => {
      const url = await fileToUrl(file);
      setUrl(url);
    })();
  }, [file, setUrl]);

  return (
    <>
      {url && (
        <Box>
          <Typography>{file.name}</Typography>
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
    accept: ".csv",
    maxFiles: 1,
    maxSize: 10000000,
    multiple: false,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton className="icon">
          <AddFileIcon />
        </IconButton>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography
            sx={{ fontSize: 15, fontWeight: 600, color: "grey.A200" }}
          >
            Drop your files here ...
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "#2B2E33",
                "& .browse": {
                  color: (theme) => theme.palette.info.main,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "underline",
                },
              }}
            >
              Select a CSV file to upload
            </Typography>
            <Typography
              sx={{ fontSize: "11px", fontWeight: 600, color: "#9A9CA0" }}
            >
              Or Drag and drop it here
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}
