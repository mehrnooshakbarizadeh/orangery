// contexts & globals

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import LinearProgress from "@mui/material/LinearProgress";
import { makeAutoObservable, observable } from "mobx";
import { Observer } from "mobx-react-lite";
import { useMutation } from "react-query";

// orangery elements & internal dependencies

// queries & backend
import { backend } from "../../queries/backend";
import { processError } from "../../queries/asset";

// icons, images & colors
import UploadIcon from "../../assets/svg/upload.svg";
import CancleIcon from "../../assets/svg/cancle.svg";
import MemoIcon from "../../assets/svg/memo.svg";
import PlusIcon from "../../assets/svg/plus.svg";
import { grey } from "@mui/material/colors";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";

export interface IDocumentData {
  uuid?: string;
  file?: File;
}
export interface IDocumentResult {
  uuid: string;
}

interface IDocumentUpload {
  uuid?: string;
  file: File;
  office_uuid: string;
  onUploadProgress: (progressEvent: any) => void;
}

async function uploadDocumentFile(
  params: IDocumentUpload
): Promise<IDocumentResult> {
  try {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("office_uuid", params.office_uuid);

    if (params.uuid) {
      const result = await backend.put(`/file/document/public`, formData, {
        headers: (formData as any).getHeaders?.(),
        onUploadProgress: params.onUploadProgress,
      });
      const finalResult = result.data.data;
      return { uuid: finalResult };
    } else {
      const result = await backend.post(`/file/document/public`, formData, {
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
async function deleteDocumentFile(uuid: string): Promise<void> {
  //TODO the endpoint is not implemented yet
}

function useUploadDocumentFile() {
  return useMutation<IDocumentResult, Error, IDocumentUpload>(
    uploadDocumentFile
  );
}
function useDeleteDocumentFile() {
  return useMutation<void, Error, string>(deleteDocumentFile, {});
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

export default function OrangeryDocumentsField({
  label,
  documents,
  onAdd,
  onRemove,
  title,
}: {
  label: React.ReactNode;
  documents: string[];
  onAdd: (uuid: string) => void;
  onRemove: (uuid: string) => void;
  title?: string;
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

  const handleAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    uploadState.setSelectingFile(true);
  };

  return (
    <>
      <Typography
        fontWeight={700}
        sx={{ color: "#2B2E33", pb: "6px", fontSize: 16 }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 1.5,
          py: 1.5,
          px: 1.6,
          gap: 1,
          backgroundColor: "rgba(7, 78, 232, 0.04)",
          border: "1px dotted #074EE8",
          width: "100%",
          cursor: "pointer",
          "& .icon svg": {
            display: "flex",
            alignItems: "center",
            width: "1.5rem",
            flexShrink: 0,
            color: "#074EE8",
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
        <Observer>
          {() => (
            <>
              <div className="icon">
                <UploadIcon
                  className={`${uploadState.selectingFile ? "selecting" : ""}`}
                />
              </div>
            </>
          )}
        </Observer>
        <div className="inner-container">
          <UploadedFiles
            documents={documents}
            uploadState={uploadState}
            title={title}
          />

          <Observer>
            {() => (
              <>
                {uploadState.files.map((file) => (
                  <FileUploader key={file.id} file={file} />
                ))}
              </>
            )}
          </Observer>
          <Observer>
            {() => (
              <>
                {uploadState.selectingFile && (
                  <FileSelect uploadState={uploadState} />
                )}
              </>
            )}
          </Observer>
        </div>
        <div className="container-action">
          <Observer>
            {() => (
              <>
                {!uploadState.selectingFile && (
                  <IconButton onClick={handleAddMore}>
                    <Box sx={{ width: "1rem" }}>
                      <PlusIcon />
                    </Box>
                  </IconButton>
                )}
              </>
            )}
          </Observer>
        </div>
      </Box>
    </>
  );
}

function UploadedFiles({
  documents,
  uploadState,
  title,
}: {
  documents: string[];
  uploadState: UploadState;
  title?: string;
}) {
  return (
    <>
      {documents?.map((document) => (
        <FileView
          key={document}
          uuid={document}
          uploadState={uploadState}
          title={title}
        />
      ))}
    </>
  );
}

function FileView({
  uuid,
  uploadState,
  title,
}: {
  uuid: string;
  uploadState: UploadState;
  title?: string;
}) {
  const mutation = useDeleteDocumentFile();
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
        display: "flex",
        width: "110%",
        alignItems: "center",
        justifyContent: "space-around",
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
        },
      }}
    >
      <DocumentUuidViewer
        uuid={uuid}
        title={title}
      />
      <IconButton onClick={handleDelete}>
        <CancleIcon className="cancel-icon" />
      </IconButton>
    </Box>
  );
}

function DocumentUuidViewer({
  uuid,
  title,
}: {
  uuid: string;
  title?: string
}) {
  const [open, setOpen] = React.useState(false);

  const handleView = () => {
    setOpen(true);
  };

  const handleHide = () => {
    setOpen(false);
  };

  return (
    // <Box sx={{ "& .document": { width: "1.3rem", height: "1.3rem" } }}>
    //   <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uuid}.pdf`} className="document" />
    // </Box>
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
            <Typography variant="h4">{title ?? "Contract PDF File"}</Typography>
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
  const mutation = useUploadDocumentFile();
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
          width: "100%",
          "& .upload-container": {
            flexGrow: 1,
          },
          "& .cancel-action svg": {
            width: "1rem",
            height: "1rem",
            flexShrink: 0,
            color: "grey.A200",
          },
          "& .cancel-action": {
            minWidth: 30,
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
            Uploading...
          </Typography>
          <Observer>
            {() => (
              <LinearProgress variant="determinate" value={file.progress} />
            )}
          </Observer>
        </div>
        <Button className="cancel-action" onClick={handleCancel} variant="text">
          <CancleIcon />
        </Button>
      </Box>
    </>
  );
}

function FileSelect({ uploadState }: { uploadState: UploadState }) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      acceptedFiles.forEach((file) => uploadState.addNewFile(file));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".pdf",
    maxFiles: 10,
    maxSize: 10000000,
    multiple: true,
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: "grey.A200" }}>
          Drop your files here ...
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            "& .max-size": {
              fontSize: "11px",
              fontWeight: "600",
              color: "#A5AAB4",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              color: "#8794A6",
              "& .browse": {
                color: "#074EE8",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "underline",
              },
            }}
          >
            Drag &#38; Drop or &nbsp;
            <span className="browse">browse</span>
          </Typography>
          <Typography className="max-size">Max file size: 10MB</Typography>
        </Box>
      )}
    </div>
  );
}
