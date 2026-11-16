import { Box, Fade, Typography } from "@mui/material";
import { IReportedUser } from "../../../../queries/content-management";
import {
  OrangeryText,
  OrangeryTooltip,
  OrangeryUserCircle,
} from "../../../OrangeryElements";

export default function ContentRow({ content }: { content: IReportedUser }) {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          py: 2.7,
          px: 2.4,
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          gap: 2,
          borderRadius: 1.5,
          mb: 1.2,
          mx: 0,
          fontSize: 16,
          fontWeight: 500,
          "& .title": {
            fontSize: 12,
            fontWeight: 600,
            color: "#A5AAB4",
            mb: "2px",
          },
          "& .name": {
            fontSize: "12.6px",
            fontWeight: 600,
            color: "#2B2E33",
          },
          "& .email": {
            fontSize: "9.9px",
            fontWeight: 400,
            color: "#2B2E33",
          },
        }}
      >
        <Box sx={{ flexBasis: "33%" }}>
          <Typography className="title">User</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,

              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <OrangeryUserCircle
              name={content.reported_by.name}
              fileName={
                typeof content.reported_by.image === "string"
                  ? content.reported_by.image
                  : undefined
              }
            />
            <Box
              sx={{
                display: "block",
                alignItems: "center",
              }}
            >
              <Typography className="name">
                <OrangeryText text={content.reported_by.name} limit={20} />
              </Typography>
              <Typography className="email">
                <OrangeryText text={content.reported_by.email} limit={20} />
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flexBasis: "33%" }}>
          <Typography className="title">Reporter</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              "& .memo-icon": { width: "1.3rem" },
            }}
          >
            <OrangeryUserCircle
              name={content.name}
              fileName={
                typeof content.image === "string" ? content.image : undefined
              }
            />
            <Box
              sx={{
                display: "block",
                alignItems: "center",
                "& .visitor-name": { textTransform: "capitalize" },
              }}
            >
              <Typography className="name">
                <OrangeryText text={content.name} limit={20} />
              </Typography>
              <Typography className="email">
                <OrangeryText text={content.email} limit={20} />
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flexBasis: "66%" }}>
          <Typography className="title">Reason</Typography>
          <Typography fontSize={12} fontWeight={700}>
            <OrangeryText text={content.description} limit={50} />
          </Typography>
        </Box>

        <Box sx={{ flexBasis: "22%", position: "absolute", right: "52px" }}>
          <Typography className="title">Report Date</Typography>
          <Typography fontSize={12} fontWeight={700}>
            {new Date(content.date).toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
