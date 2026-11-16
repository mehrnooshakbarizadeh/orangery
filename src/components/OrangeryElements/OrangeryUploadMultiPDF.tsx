import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { FileRejection, useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import { makeAutoObservable, observable, observe } from "mobx";
import { observer, Observer } from "mobx-react-lite";
import { useMutation } from "react-query";
import { backend } from "../../queries/backend";
import { processError } from "../../queries/asset";
import PdfFileIcon from "../../assets/svg/pdf-file.svg";
import CancleIcon from "../../assets/svg/cancle.svg";
import MemoIcon from "../../assets/svg/memo.svg";
import AddFileIcon from "../../assets/svg/addFile.svg";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import { DialogTitle } from "@material-ui/core";

export interface IImageData {
  uuid?: string;
  file?: File;
}
export interface IImageResult {
  uuid: string;
}

interface IImageUpload {
  uuid?: string;
  file: File;
  office_uuid: string;
  onUploadProgress: (progressEvent: any) => void;
}

async function uploadAssetFile(params: IImageUpload): Promise<IImageResult> {
  try {
    const formData = new FormData();
    formData.append("file", params.file);
    // formData.append("office_uuid", params.office_uuid);
    console.log(params.file);
    if (params.uuid) {
      const result = await backend.put(`/file/document`, formData, {
        headers: (formData as any).getHeaders?.(),
        onUploadProgress: params.onUploadProgress,
      });
      const finalResult = result.data.data;
      return { uuid: finalResult };
    } else {
      const result = await backend.post(`/file/document`, formData, {
        headers: (formData as any).getHeaders?.(),
        onUploadProgress: params.onUploadProgress,
      });
      const finalResult = result.data.data;
      return { uuid: finalResult };
    }
  } catch (err: any) {
    const processedError = processError(err);
    throw processedError;
  }
}

async function deleteAssetFile(uuid: File | string): Promise<void> {
  //TODO the endpoint is not implemented yet
}

function useUploadAssetFile() {
  return useMutation<IImageResult, Error, IImageUpload>(uploadAssetFile);
}

function useDeleteAssetFile() {
  return useMutation<void, Error, File | string>(deleteAssetFile, {});
}

class FileUploadState {
  public id: string;
  constructor(
    public file: File,
    public started: boolean,
    public progress: number,
    private parent: UploadState
  ) {
    this.id =
      crypto?.randomUUID?.() || Math.round(Math.random() * 1000000).toString();
    makeAutoObservable(this, {
      file: false,
    });
  }

  setProgress(value: number) {
    if (!this.started) this.started = true;
    this.progress = value;
  }

  uploaded(uuid: string) {
    this.parent.onAdd?.(uuid);
    this.parent.removeFile(this);
  }

  remove() {
    this.parent.removeFile(this);
  }
}

class UploadState {
  public files = observable.array<FileUploadState>();
  public selectingFile = true;
  public onAdd?: (uuid: string) => void;
  public onRemove?: (uuid: string) => void;

  constructor() {
    makeAutoObservable(this, {
      onAdd: false,
      onRemove: false,
    });
  }

  addNewFile(file: File) {
    const fileUpload = new FileUploadState(file, false, 0, this);
    this.files.push(fileUpload);
    this.selectingFile = false;
  }

  removeFile(file: FileUploadState) {
    const index = this.files.findIndex((f) => f === file);
    if (index === -1) return;
    this.files.splice(index, 1);
  }

  setSelectingFile(value: boolean) {
    this.selectingFile = value;
  }
}

export default function OrangeryUploadMultiPDF({
  documents,
  onAdd,
  onRemove,
}: {
  documents: string[];
  onAdd: (uuid: string) => void;
  onRemove: (uuid: string) => void;
}) {
  const [uploadState] = React.useState(() => new UploadState());
  React.useEffect(() => {
    if (documents.length === 0) {
      uploadState.setSelectingFile(true);
    }
  }, [documents, uploadState]);

  React.useEffect(() => {
    uploadState.onAdd = onAdd;
    uploadState.onRemove = onRemove;
  });

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            borderRadius: 1.5,
            px: 2,
            py: 3,
            gap: 1,
            width: "100%",
            height: "104px",
            cursor: "pointer",
            "& .inner-container": {
              zIndex: 1,
            },
            "& .container-action": {
              flexShrink: 0,
            },
            "& .glow-container": {
              position: "absolute",
              width: "100%",
              height: "100%",
              inset: 0,
            },
            "& .glow-blur": {
              display: "block",
              width: "100%",
              height: "100%",
              fill: "transparent",
              stroke: "#074EE8",
              strokeWidth: "3px",
              strokeDasharray: "12 12",
              rx: "5px",
            },
          }}
        >
          <svg className="glow-container">
            <rect pathLength={3000} className="glow-blur"></rect>
          </svg>
          <div className="inner-container">
            <Observer>
              {() => (
                <>
                  <FileSelect uploadState={uploadState} />
                </>
              )}
            </Observer>
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 3,
            width: "98%",
          }}
        >
          <Observer>
            {() => (
              <>
                <UploadedFile documents={documents} uploadState={uploadState} />
              </>
            )}
          </Observer>
          <Observer>
            {() => (
              <>
                {uploadState.files.map((file) => (
                  <FileUploader key={file.id} file={file} />
                ))}
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </>
  );
}

const UploadedFile = observer(
  ({
    documents,
    uploadState,
  }: {
    documents: string[];
    uploadState: UploadState;
  }) => {
    return (
      <>
        <Observer>
          {() => (
            <>
              {documents && (
                <>
                  {documents.map((doc) => (
                    <FileView uuid={doc} uploadState={uploadState} key={doc} />
                  ))}
                </>
              )}
            </>
          )}
        </Observer>
      </>
    );
  }
);

function FileView({
  uuid,
  uploadState,
}: {
  uuid: string;
  uploadState: UploadState;
}) {
  const mutation = useDeleteAssetFile();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(uuid);
      uploadState.onRemove?.(uuid);
    } catch (err: any) {
      //TODO handle the error
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: "4px",
        display: "flex",
        jusContent: "flex-end",
        width: "100%",
        alignItems: "center",
        backgroundColor: "#E4F5E9",
        borderRadius: 1,
        gap: 1,
        "& .copy": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 15,
          fontWeight: 600,
          color: "grey.A200",
        },
        "& .cancel-icon": {
          width: "1rem",
          height: "1rem",
          borderRadius: "10%",
          color: "#000",
          // ml: 4,
        },
      }}
    >
      <Box sx={{ display: "flex", alifnItems: "center", flexGrow: 1, gap: 2 }}>
        <ImageUuidViewer uuid={uuid} />
      </Box>
      <IconButton onClick={handleDelete} sx={{ width: 32, ml: 4 }}>
        <CancleIcon className="cancel-icon" />
      </IconButton>
    </Box>
  );
}

function ImageUuidViewer({ uuid }: { uuid: File | string }) {
  const [open, setOpen] = React.useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleHide = () => {
    setOpen(false);
  };
  return (
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
            <Typography variant="h4">{"Contract PDF File"}</Typography>
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
          <iframe
            title="Asset Invoice"
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uuid}.pdf`} ////////!!!!!!!!
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function FileUploader({ file }: { file: FileUploadState }) {
  const mutation = useUploadAssetFile();
  const { office_uuid } = useGlobalState();

  const startUpload = async () => {
    const result = await mutation.mutateAsync({
      file: file.file,
      office_uuid: office_uuid,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const precentage = Math.floor((loaded * 100) / total);
        file.setProgress(precentage);
      },
    });
    file.uploaded(result.uuid);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!mutation.isLoading) {
      const timeout = setTimeout(startUpload, 2000);
      return () => clearTimeout(timeout);
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "99%",
          alihItems: "center",
          backgroundColor: "#E4F5E9",
          "& .upload-container": {
            flexGrow: 1,
            py: "6px",
            pl: "6px",
            pr: "16px",
          },
          "& .cancel-action svg": {
            width: "1rem",
            height: "1rem",
            flexShrink: 0,
            color: "grey.A200",
          },
          "& .cancel-action": {
            // minWidth: 30,
            width: "1rem",
            height: "1rem",
            borderRadius: "10%",
            color: "#000",
          },
        }}
      >
        <div className="upload-container">
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "grey.A200",
            }}
          >
            {`Uploading ${file.file.name}`}
          </Typography>
          <Observer>
            {() => (
              <LinearProgress variant="determinate" value={file.progress} />
            )}
          </Observer>
        </div>
        {/* <Button className="cancel-action" onClick={handleCancel} variant="text">
          <CancleIcon />
        </Button> */}
      </Box>
    </>
  );
}

function FileSelect({ uploadState }: { uploadState: UploadState }) {
  const [errors, setErrors] = useState<string>("");
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file) => uploadState.addNewFile(file));
    }
    if (fileRejections.length) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            setErrors(`Error: ${err.message}`);
          }

          if (err.code === "file-invalid-type") {
            setErrors(`Error: ${err.message}`);
          }
        });
      });
    } else {
      setErrors("");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".pdf",
    maxFiles: 1000,
    maxSize: 10000000,
    multiple: false,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <Typography color="#FF3D00" sx={{ ml: 12 }}>
        {errors}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          // px: 2,
          "& .icon": {
            width: "1.8rem",
            height: "1.5rem",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F9F9FA",
            px: "11px",
            py: "13.6px",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton sx={{ ml: 1 }}>
            <AddFileIcon className="icon" />
          </IconButton>
        </Box>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#2B2E33" }}>
            Drop your file here ...
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              "& .max-size": {
                fontSize: "12px",
                fontWeight: "600",
                color: "#A5AAB4",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 400,
                color: "#2B2E33",
              }}
            >
              Select files to upload or drop here
            </Typography>
            <Typography className="max-size">Max file size: 10MB</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}
