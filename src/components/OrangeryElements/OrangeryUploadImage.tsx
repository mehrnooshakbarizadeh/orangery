import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import { IMedia } from "../../queries/media";
import { useMedias, useUploadFile } from "../../queries/uploadImage";
import CancelIcon from "@mui/icons-material/Cancel";
import CrossIcon from "../../assets/svg/cross.svg";
import PlaceholderSvg from "../../assets/svg/placeholders/media.svg";
import UploadFileIcon from "../../assets/svg/image-icon.svg";
import CheckBoxSVG from "../../assets/svg/checkBox-svg.svg";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import {
  OrangeryImagesField,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryText,
} from ".";
import { observer, Observer } from "mobx-react-lite";
import { makeAutoObservable, observable } from "mobx";
import { useImagesFile } from "../dashboard/meetingRooms/GetImagesFile";
import UplaodComponent from "./OrangeryUplaodComponent";
import OrangeryUplaodComponent from "./OrangeryUplaodComponent";

class FileUploadState {
  public id: string;

  constructor(
    public file: File,
    public started: boolean,
    public progress: number,
    private parent: UploadState
  ) {
    this.id =
      crypto?.randomUUID?.() || Math.round(Math.random() * 10000000).toString();
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

export class UploadState {
  public files = observable.array<FileUploadState>();
  public selectingFile = true;
  public onAdd?: (uuid: string) => void;
  public onRemove?: (uuid: string) => void;
  public images: IMedia[] = [];

  constructor() {
    makeAutoObservable(this, {
      onAdd: false,
      onRemove: false,
    });
  }

  setImageReader(images: IMedia[]) {
    this.images = images;
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

export const UploadImageComponent = observer(
  ({
    images,
    handleChange,
    limit = 1000,
    sx,
  }: {
    images: string[];
    handleChange: (value: string[]) => void;
    limit?: number;
    sx?: SxProps<Theme> | undefined;
  }) => {
    const imagesFile = useImagesFile(images);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const bigSize = false;

    const handleDrop = (uuid: string) => {
      if (!uuid) return;
      const i = images.findIndex((image) => image === uuid);
      if (i !== -1) {
        images.splice(i, 1);
        handleChange(images);
      }
    };

    return (
      <>
        <Box
          sx={{
            ...sx,
            position: "relative",
            gap: 1,

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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={() => handleOpen()}
              sx={{
                zIndex: 1,
                width: "30%",
                justifyContent: "flex-start",
                flexGrow: 1,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  m: 1,
                  p: 3,
                  // width: "70px",
                  // height: "70px",
                  backgroundColor: "#ECF2FF",
                  borderRadius: "5px",
                  "& .upload-icon": {
                    width: "1.8rem",
                    height: "1.8rem",
                  },
                }}
              >
                <UploadFileIcon className="upload-icon" />
              </Box>
              <Box sx={{ whiteSpace: "nowrap" }}>
                <Typography fontSize="16px" fontWeight={400}>
                  {`Drop file${limit > 1 ? "s" : ""} here or browse`}
                </Typography>
                <Typography
                  textAlign="left"
                  fontSize="12px"
                  fontWeight={600}
                  color=" #A5AAB4"
                >
                  Max file size: 10MB
                </Typography>
              </Box>
            </Button>

            <Box
              sx={{
                width: "61%",
                position: "absolute",
                right: "10px",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  flexDirection: "row-reverse",
                  width: "100%",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {},
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,.1)",
                    borderRadius: 5,
                  },
                  "& .image": {
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    objectFit: "fill",
                  },
                }}
              >
                <Observer>
                  {() => (
                    <>
                      {imagesFile.length > 0 && (
                        <>
                          {imagesFile.map((mediaObject) => (
                            <Box
                              key={mediaObject.uuid}
                              sx={{
                                width: "80px",
                                height: "85px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "76px",
                                  height: "100%",
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() => handleDrop(mediaObject.uuid)}
                                  sx={{
                                    "&.MuiIconButton-root": {
                                      position: "absolute",
                                      right: "-4px",
                                      zIndex: 1,
                                      top: "-2px",
                                      p: 0,
                                    },
                                    "& .cancel-svg": {
                                      fill: "#000",
                                    },
                                  }}
                                >
                                  <CancelIcon className="cancel-svg" />
                                </IconButton>
                                <Box
                                  sx={{
                                    width: "80px",
                                    height: "58px",
                                    overflow: "hidden",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/${mediaObject?.uuid}.jpg)`,
                                    // backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/thumbnail/${mediaObject?.uuid}.jpg)`,
                                    border: "1px solid #EDEEF0",
                                    borderRadius: "8px",
                                  }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </Observer>
              </Box>
            </Box>
          </Box>
          <svg className="glow-container">
            <rect pathLength={3000} className="glow-blur"></rect>
          </svg>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              maxWidth: 1262,
              width: 1262,
              height: 886,
              minHeight: 892,
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {open && (
              <Observer>
                {() => (
                  <UploadDialog
                    handleClose={handleClose}
                    images={images}
                    handleChange={handleChange}
                    limit={limit}
                  />
                )}
              </Observer>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

function UploadDialog({
  handleClose,
  images,
  handleChange,
  limit,
}: {
  handleClose: () => void;
  images: string[];
  handleChange: (value: string[]) => void;
  limit?: number;
}) {
  const uploadState = useState(() => new UploadState())[0];
  const [error, setError] = useState(false);

  const uploadLimit = limit || 10000;

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <>
      <form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            pr: 3,
            pl: 3,
            py: 3,
            borderBottom: "1px solid #EDEEF0",
          }}
        >
          <Typography
            sx={{ flexGrow: 1, fontSize: 24, fontWeight: 600, color: "#000" }}
          >
            Add image
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              display: "flex",
              "& .cancel-icon": {
                width: "1.3rem",
                height: "1.3rem",
                color: "#000",
              },
            }}
          >
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2, height: "20%", px: 3 }}>
          <Observer>
            {() => (
              <>
                <OrangeryUplaodComponent
                  uploadState={uploadState}
                  limit={limit}
                />
              </>
            )}
          </Observer>
        </Box>
        <Observer>
          {() => (
            <UploadedImage
              images={images}
              handleChange={handleChange}
              uploadState={uploadState}
              limit={limit}
              onSetError={setError}
            />
          )}
        </Observer>

        <Box
          sx={{
            width: "100%",
            py: 2,
            borderTop: "1px solid #EDEEF0",
            display: "flex",
            alignItems: "center",
            gap: 2,
            pr: 2,
            position: "absolute",
            right: 0,
            bottom: "16px",
            justifyContent: "end",
            "& .add-btn": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <Observer>
            {() => (
              <Box sx={{ flexGrow: 1, pl: 4 }}>
                <Typography>
                  {images.length >= uploadLimit ? (
                    <>
                      <Typography
                        fontSize={18}
                        fontWeight={600}
                        color="#FF3D00"
                      >
                        &quot;Limit selected items&quot;
                      </Typography>
                      <Typography
                        fontSize={13}
                        fontWeight={600}
                        color="#55585C"
                      >
                        {`No more than ${limit} photo${
                          limit! > 1 ? "s" : ""
                        } can be uploaded.`}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{ display: "flex", alignItems: "center" }}
                      color="#2B2E33"
                      fontSize={18}
                      fontWeight={600}
                    >
                      {`${images.length} file${
                        images.length > 1 ? "s" : ""
                      } selected`}
                    </Typography>
                  )}
                </Typography>
              </Box>
            )}
          </Observer>
          <Observer>
            {() => (
              <Button
                onClick={handleClose}
                sx={{
                  display: "flex",
                  gap: 2,
                  mr: 1,
                  py: "12px",
                  px: 5,
                  "& .cancel": {
                    fontSize: "21px",
                    fontWeight: 600,
                  },
                }}
                variant="text"
              >
                <Typography className="cancel">Cancel</Typography>
              </Button>
            )}
          </Observer>
          <Observer>
            {() => (
              <Button
                onClick={handleSubmit}
                sx={{
                  display: "flex",
                  gap: 2,
                  mr: 1,
                  py: "12px",
                  px: 5,
                  "& .add": {
                    fontSize: "21px",
                    fontWeight: 600,
                  },
                }}
                color="primary"
                variant="contained"
              >
                <Typography className="add">Add Images</Typography>
              </Button>
            )}
          </Observer>
        </Box>
      </form>
    </>
  );
}

const UploadedImage = ({
  images,
  uploadState,
  limit,
  handleChange,
  onSetError,
}: {
  images: string[];
  uploadState: UploadState;
  limit?: number;
  handleChange: (value: string[]) => void;
  onSetError: (value: boolean) => void;
}) => {
  const globalState = useGlobalState();
  const { data: availableMedias, isLoading } = useMedias(
    globalState.office_uuid
  );
  const medias =
    availableMedias?.filter((media) => media.is_image).map((md) => md) || [];

  useEffect(() => {
    if (images.length === 0) {
      uploadState.setSelectingFile(true);
    }
  }, [images, uploadState]);

  const handleAddMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    uploadState.setSelectingFile(true);
  };

  return (
    <>
      <Observer>
        {() => (
          <>
            {isLoading ? (
              <Box sx={{ pt: "148px" }}>
                <OrangeryNavigationContentLoader />
              </Box>
            ) : (medias && medias.length > 0) ||
              uploadState.files.length > 0 ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  height: "576px",
                  overflowY: "auto",
                  borderRadius: 1.5,
                  py: 3,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    px: 1,
                    flexBasis: "fit-content",
                    overflowY: "auto",
                    height: "calc(100vh - 72px)",
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
                  }}
                >
                  <>
                    {uploadState.files && (
                      <>
                        {uploadState.files.map((file) => (
                          <FileUploader key={file.id} file={file} />
                        ))}
                      </>
                    )}
                  </>
                  <>
                    {medias?.map((media) => (
                      <ImageCard
                        key={media.uuid}
                        media={media}
                        images={images}
                        limit={limit}
                        handleChange={handleChange}
                        selected={
                          !!images.find((image) => image === media.uuid)
                        }
                        onSetError={onSetError}
                      />
                    ))}
                  </>
                </Box>
              </Box>
            ) : uploadState.files.length === 0 ? (
              <OrangeryNavigationPlaceholder
                vertical
                width={176}
                height={123}
                title={"No Media Files!"}
                subtitle={"You have not uploaded any file."}
                PlaceholderSvg={PlaceholderSvg}
                AddNewButton={<></>}
                addNewButtonText={""}
              />
            ) : null}
          </>
        )}
      </Observer>
    </>
  );
};

const ImageCard = ({
  media,
  bigSize = false,
  selected,
  images,
  handleChange,
  limit,
  onSetError,
}: {
  media: IMedia;
  bigSize?: boolean;
  selected: boolean;
  images: string[];
  limit?: number;
  handleChange: (value: string[]) => void;
  onSetError: (value: boolean) => void;
}) => {
  const handleToggle = (image_id: string) => {
    const newValues = [...images];
    const index = newValues.findIndex((v) => v === image_id);
    if (index !== -1) {
      newValues.splice(index, 1);
    } else if (newValues.length < limit!) {
      newValues.push(image_id);
    } else {
      onSetError(true);
    }

    if (newValues.length === limit) {
    }
    if (newValues.length < 1 || newValues.length > limit!) {
      onSetError!(true);
    }
    handleChange(newValues);
  };

  return (
    <>
      <Box
        onClick={() => handleToggle(media.uuid)}
        sx={{
          "&:hover": {
            border: "2px solid #000",
            transition: "all 0.3s ease-in-out",
            cursor: "pointer",
          },
          border: selected ? "2px solid #000" : "1.2px solid #EDEEF0",
          borderRadius: "10px",
          p: 1,
          mt: 1.5,
          position: "relative",
          "& .image": {
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            objectFit: "fill",
          },
          "& .checkbox": {
            position: "absolute",
            top: "-13px",
            left: "170px",
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
          },
          width: !media.is_image ? "180px" : "198px",
          height: !media.is_image ? "126px" : "202",
          overflowX: !media.is_image ? "clip" : "",
        }}
      >
        {selected ? <CheckBoxSVG className="checkbox" /> : ""}
        <Box
          sx={{
            width: "180px",
            height: "120px",
            overflow: "hidden",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/${media?.uuid}.jpg)`,
            border: "1px solid #EDEEF0",
            borderRadius: "8px",
          }}
        />

        <OrangeryText text={media.name} limit={10} />
        <Typography mt={2} fontSize={11} fontWeight={600} color="#A5AAB4">
          {media.size?.toString().slice(0, 2)}
          &nbsp;kB
        </Typography>
      </Box>
    </>
  );
};

function FileUploader({ file }: { file: FileUploadState }) {
  const mutation = useUploadFile();
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

  useEffect(() => {
    if (!mutation.isLoading) {
      const timeout = setTimeout(startUpload, 200);
      return () => clearTimeout(timeout);
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "17%",
          borderRadius: "10px",
          border: "1.2px solid #EDEEF0",
          p: 1,
          mt: 1.5,
          "& .upload-container": {
            flexGrow: 1,
            backgroundColor: "#dfdfc8",
            borderRadius: "10px",
            width: "186px",
            height: "119px",
          },
        }}
      >
        <div className="upload-container">
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "grey.A200",
              mt: 5,
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
        <Box sx={{ pt: 1 }}>
          <OrangeryText text={file.file.name} limit={10} />
          <Typography mt={2} fontSize={11} fontWeight={600} color="#A5AAB4">
            {file.file.size?.toString().slice(0, 2)}
            &nbsp;kB
          </Typography>
        </Box>
      </Box>
    </>
  );
}
