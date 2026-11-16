// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import PreviewRoomContent from "./PreviewRoomContent";
import RoomPreviewOffer from "./RoomPreviewOffer";
import OverviewSelectedItems from "./OverviewSelectedItems";
import { OrangeryCarousel } from "../../../OrangeryElements";

// queries & backend
import { IRoom } from "../../../../queries/room";

// icons, images & colors
import CrossIcon from "../../../../assets/svg/cross.svg";

export default function RoomOverviewContent({
  room,
  handleClose,
}: {
  room: IRoom;
  handleClose: () => void;
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
            py: 2,
            px: 4,
            "& .form-title": { flexGrow: 1 },
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <Typography variant="h2" className="form-title">
            Overview
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            mt: 2,
            mr: 2,
            height: "calc(100% - 200px)",
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
            p: 4,
          }}
        >
          <Typography variant="h4">Preview</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              pt: 2,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <OrangeryCarousel
                images={room.images.map((image) => image.uuid)}
              />
            </Box>
            <PreviewRoomContent room={room} />
            {room.product && (
              <RoomPreviewOffer offer={room.product} customer={room.customer} />
            )}
          </Box>
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Box sx={{ pb: 3 }}>
              <Typography variant="h2">Items</Typography>
              <Observer>
                {() => (
                  <Typography fontSize={18} fontWeight={400}>
                    You have selected{" "}
                    {room.assets?.length +
                      room.desks?.length +
                      room.doors?.length}{" "}
                    Item
                    {room.assets?.length +
                      room.desks?.length +
                      room.doors?.length >
                      1
                      ? "s"
                      : ""}
                  </Typography>
                )}
              </Observer>
            </Box>
            {(room.desks?.length > 0 ||
              room.assets?.length > 0 ||
              room.doors?.length)
              ? <OverviewSelectedItems room={room} />
              : <></>
            }
          </Box>
        </Box>

        <Box className="footer">
          <Box>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{ fontSize: 20, px: 8, py: 2 }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
