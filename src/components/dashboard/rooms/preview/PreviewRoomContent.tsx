// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryText, OrangeryUserCircle } from "../../../OrangeryElements";

// queries & backend
import { IRoom } from "../../../../queries/room";

export default function PreviewRoomContent({
  room,
}: {
  room?: IRoom;
}) {
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          "& .column-align": {
            display: "flex",
            flexDirection: "column",
            pb: 4,
          },
          "& .content-second-row": { display: "flex", gap: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            pb: 2,
          }}
        >
          <Typography variant="h6">Room Name</Typography>
          <Typography variant="h2">
            <OrangeryText text={room?.name} limit={20} />
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            pb: 4,
          }}
        >
          <Typography variant="h6">DESCRIPTION</Typography>
          <Typography variant="h6">
            <OrangeryText text={room?.description || "-"} limit={40} />
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">DESKS</Typography>
            <Typography variant="h6">{room?.desks.length || "-"}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">ASSETS</Typography>
            <Typography variant="h6">{room?.assets.length || "-"}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">DOORS</Typography>
            <Typography variant="h6">{room?.doors?.length || "-"}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">DEPARTMENT</Typography>
            <Typography variant="h6">{<OrangeryText text={room?.department?.name || "-"} limit={10} />}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6">ASSIGNED USERS</Typography>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {room?.users?.length ? (
                room.users.map((user) => (
                  <OrangeryUserCircle
                    key={user.name}
                    name={user.name ?? user.first_name + " " + user.last_name}
                    fileName={
                      typeof user?.image === "string" ? user?.image : undefined
                    }
                    size={32}
                  />
                ))
              ) : (
                <Typography variant="h6">-</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
