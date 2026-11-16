import { Observer } from "mobx-react-lite";
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  IEvent,
  IEventModification,
  usePatchEvent,
} from "../../../../../queries/event";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { OrangeryToast } from "../../../../OrangeryElements";

export default function EditForm({
  logService,
  handleClose,
  event,
}: {
  logService: IEventModification[];
  handleClose: () => void;
  event: IEvent;
}) {
  console.log(logService);
  const lastValue =
    logService[0].status === "requested" ? logService[0].suggestion : "";
  return (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 4,
          py: 3.5,
          gap: 4,
          display: "flex",
          // flexDirection: 'column',
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #EDEEF0",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#000" }}>
          Edit Services
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            display: "flex",
            "& .cancel-icon": { width: "1.3rem", height: "1.3rem" },
          }}
        >
          <CrossIcon className="cancel-icon" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pl: 4,
          mt: 3,
          mb: 3,
        }}
      >
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4">
          Current
        </Typography>
        <Typography fontSize={19} fontWeight={600} color="#2B2E33">
          {event?.assets.map((asset) => asset.grouped_name)}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 4 }}>
        <Typography fontSize={18} fontWeight={600} color="#A5AAB4" pb={4}>
          Customer Suggestion
        </Typography>

        <Observer>
          {() => (
            <>
              {lastValue && (
                <Typography fontSize={19} fontWeight={600} color="#55585C">
                  {lastValue}
                </Typography>
              )}
            </>
          )}
        </Observer>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid #EDEEF0",
          position: "absolute",
          bottom: "30px",
          right: "0px",
          width: "100%",
          textAlign: "end",
        }}
      >
        <Button
          onClick={handleClose}
          variant="text"
          // color="primary"
          sx={{ mt: 4, mr: 4, px: 5, py: 2, fontSize: 21, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ mt: 4, mr: 4, px: 5, py: 2, fontSize: 21, fontWeight: 600 }}
        >
          Done
        </Button>
      </Box>
    </>
  );
}
