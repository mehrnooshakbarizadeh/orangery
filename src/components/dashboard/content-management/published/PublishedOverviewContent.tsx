import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import {
  IAuthor,
  IPublishedContent,
  useUpsertBlockContent,
} from "../../../../queries/content-management";
import CrossIcon from "../../../../assets/svg/cross.svg";
import {
  OrangeryCarousel,
  OrangeryText,
  OrangeryToast,
  OrangeryUserCircle,
} from "../../../OrangeryElements";
import { BlockState } from "./PublishedTab";
import { Observer } from "mobx-react-lite";

export default function PublishedOverviewContent({
  overview,
  handleClose,
  blockState,
}: {
  overview: IPublishedContent;
  handleClose: () => void;
  blockState: BlockState;
}) {
  const mutation = useUpsertBlockContent();
  const handleBlock = (e: React.FormEvent) => {
    blockState.publish.value = false;
    handleSubmit(e);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutation.mutateAsync(blockState.data);
      handleClose();
      OrangeryToast("Successfully Blocked " + overview.title, "success");
    } catch (err: any) {
      // state.setupErrors(err);
      console.log("error");
    }
  }

  const blockText =
    "Blocking content prevents it from showing in the community until you unblock it. Also, the system automatically sends an email to this user.";
  return (
    <form onSubmit={handleBlock}>
      <Box
        sx={{
          height: "100%",
          "& .footer": {
            gap: 1.5,
            position: "absolute",
            right: 0,
            bottom: "19px",
            paddingRight: "24px",
            borderTop: "1px solid #EDEEF0",
            width: "100%",
            display: "flex",
            justifyContent: "end",
            paddingTop: "21px",
            JustifyContent: "end",
            pl: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            py: 4,
            px: 4,
            "& .form-title": { flexGrow: 1 },
            "& .cancel-icon": {
              width: "1.3rem",
              height: "1.3rem",
              color: "black",
            },
          }}
        >
          <Typography variant="h2" className="form-title">
            {overview.title}
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            mr: 2,
            // height: "calc(100% - 220px)",
            // overflowY: "auto",
            // "&::-webkit-scrollbar": {
            //   width: "0.4em",
            // },
            // "&::-webkit-scrollbar-track": {
            //   marginLeft: "20px",
            // },
            // "&::-webkit-scrollbar-thumb": {
            //   backgroundColor: "rgba(0,0,0,.1)",
            //   borderRadius: 5,
            // },
            px: 4,
            "& .content-first-row": {
              display: "flex",
              gap: 3,
              pt: 2,
            },
            "& .left-box": { width: "44%" },
            "& .center-box": {
              width: "55%",
              height: "calc(100% - 220px)",
              overflowY: "auto",
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
            },
            "& .right-box": { width: "32%" },
          }}
        >
          <Box className="content-first-row">
            <Box className="left-box">
              <OrangeryCarousel
                width={525}
                height={320}
                images={overview.images.map((image) => image.uuid)}
              />
              <PublishedAuthor overview={overview} />
            </Box>
            <Box className="center-box">{overview.body}</Box>
          </Box>
        </Box>
        <Box className="footer">
          <Typography
            fontSize={13}
            fontWeight={400}
            sx={{
              width: "48%",
              position: "absolute",
              left: "10px",
              bottom: "10px",
            }}
          >
            {blockText}
          </Typography>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ fontSize: 20, px: "44px", py: 2, height: "55px" }}
          >
            Cancel
          </Button>
          <Observer>
            {() => (
              <Button
                // onClick={handleBlock}
                variant="contained"
                type="submit"
                sx={{
                  fontSize: 20,
                  px: "13px",
                  py: 2,
                  backgroundColor: "#FF3D00",
                  height: "55px",
                  "&:hover": {
                    backgroundColor: "#FF3D00 !important",
                  },
                }}
              >
                Block Content
              </Button>
            )}
          </Observer>
        </Box>
      </Box>
    </form>
  );
}

const PublishedAuthor = ({ overview }: { overview: IPublishedContent }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", pt: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          flex: 1,
          "& .memo-icon": { width: "1.3rem" },
        }}
      >
        <OrangeryUserCircle
          name={overview.author.name}
          fileName={
            typeof overview.author?.image === "string"
              ? overview.author?.image
              : undefined
          }
        />
        <Box
          sx={{
            display: "block",
            alignItems: "center",
            "& .name": { textTransform: "capitalize" },
          }}
        >
          <Typography fontSize={16} fontWeight={600} className="name">
            <OrangeryText text={overview.author.name} limit={20} />
          </Typography>
          <Typography
            fontSize={13}
            fontWeight={600}
            color="#A5AAB4"
            className="name"
          >
            <OrangeryText text={overview.author.email} limit={20} />
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography fontSize={15} fontWeight={600} color="#A5AAB4">
          Published on
        </Typography>
        <Typography fontSize={15} fontWeight={600}>
          {new Date(overview.created_date).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </Typography>
      </Box>
    </Box>
  );
};
