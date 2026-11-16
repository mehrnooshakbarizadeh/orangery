import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import {
  IEmployeeInfo,
  IEvent,
  IEventResult,
  IPresenter,
} from "../../../../queries/event";
import CrossIcon from "../../../../assets/svg/cross.svg";
import ArrowIcon from "../../../../assets/svg/arrowToRight.svg";
import MediaLinkIcon from "../../../../assets/svg/link-media.svg";
import { OrangeryCarousel } from "../../../OrangeryElements";

export default function EventOverviewContent({
  eventResult,
  event,
  handleClose,
}: {
  event: IEvent;
  eventResult?: IEventResult;
  handleClose?: () => void;
}) {
  return (
    <>
      <Box
        sx={{
          height: "100%",
          "& .footer": {
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
            px: 4,
            py: 2,
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
          <Typography fontSize={24} fontWeight={600} className="form-title">
            {event.name} / Preview
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            // mt: 2,
            mr: 2,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 210px)",
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
            p: 2.5,
            gap: 3,
            "& .content-first-row": {
              display: "flex",
              gap: 3,
            },
            // "& .left-box": { width: "40%" },
            "& .right-box": { width: "60%" },
          }}
        >
          <Box className="content-first-row">
            <Box sx={{ width: "44%" }}>
              <OrangeryCarousel
                width={525}
                height={320}
                images={event?.images.map((image) => image.uuid)}
              />
            </Box>
            <Box className="right-box">
              <OverviewContent event={event} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              "& .box": {
                backgroundColor: "#F9F9FA",
                borderRadius: 2.2,
                p: 2,
                height: "290px",
                width: "401px",
                overflow: "auto",
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
            }}
          >
            <OrganizerBox event={event} />
            <PresentersBox values={event.presenters} title="Presenter" />
            <PresentersBox values={event.attendees} title="Attendee" />
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: "19px",
            paddingRight: "24px",
            borderTop: "1px solid #EDEEF0",
            width: "100%",
            display: "flex",
            justifyContent: "end",
            paddingTop: "21px",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ fontSize: 20, px: 8, py: 2 }}
          >
            OK
          </Button>
        </Box>
      </Box>
    </>
  );
}

const OrganizerBox = ({ event }: { event: IEvent }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          "& .box": {
            backgroundColor: "#F9F9FA",
            borderRadius: 2.2,
            p: 2,
            height: "290px",
            width: "401px",
            overflow: "auto",
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
        }}
      >
        <Box className="box">
          <Typography fontSize={18} fontWeight={600} sx={{ mb: 3 }}>
            Organizer
          </Typography>
          <Typography fontSize={19} fontWeight={600}>
            {/* {event.organizers?.name} */}
          </Typography>
          <Typography fontSize={18} fontWeight={600} color={"#A5AAB4"}>
            {/* <Typography>{event.organizer?.email}</Typography> */}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 3, gap: 1 }}>
            {event.organizer_media ? (
              <>
                <MediaLinkIcon />
                <Typography>{event.organizer_media}</Typography>
              </>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
const PresentersBox = ({
  values,
  title,
}: {
  values: IEmployeeInfo[];
  title: string;
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          "& .box": {
            backgroundColor: "#F9F9FA",
            borderRadius: 2.2,
            p: 2,
            height: "290px",
            width: "401px",
            overflow: "auto",
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
        }}
      >
        <Box className="box">
          <Typography fontSize={18} fontWeight={600} sx={{ mb: 3 }}>
            {values.length > 1 ? `${title}s` : `${title}`}
          </Typography>
          {values.map((value) => (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              key={value.uuid}
            >
              <Typography fontSize={19} fontWeight={600}>
                {value.name}
              </Typography>
              <Typography fontSize={18} fontWeight={600} color={"#A5AAB4"}>
                {value.email}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

const OverviewContent = ({ event }: { event: IEvent }) => {
  return (
    <>
      <Box
        sx={{
          "& .column": { py: 3 },
          "& .grey-title": {
            color: "#A5AAB4",
            fontSize: "15px",
            fontWeight: "600",
          },
          "& .sub-title": {
            color: "#2B2E33",
            fontSize: "19px",
            fontWeight: "600",
          },
        }}
      >
        <Box
          sx={{
            pb: event.description ? "1px" : "64px",
            color: !event.description ? "#A5AAB4" : "#2B2E33",
            "& .MuiTypography-root": {
              fontSize: !event.description ? "15px" : "19px",
            },
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
          <Typography width="100%">
            {event.description ? event.description : "No Description"}
          </Typography>
        </Box>
        <Divider />
        <Box className="column">
          <Typography className="grey-title">Address</Typography>
          <Typography fontSize={19} fontWeight={700}>
            {event.location ? event.location : "-"}
          </Typography>
        </Box>
        <Divider />
        <Box className="column">
          <Typography className="grey-title">Date and Time</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography className="sub-title">
              {new Date(event.start_time).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h24",
              })}
            </Typography>
            <ArrowIcon />
            <Typography className="sub-title">
              {new Date(event.end_time).toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h24",
              })}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box className="column" sx={{ pb: 0 }}>
          <Typography className="grey-title">Price</Typography>
          <Typography fontSize={19} fontWeight={700}>
            {event.price === 0 ? "Free" : `${event.price} Euro`}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
