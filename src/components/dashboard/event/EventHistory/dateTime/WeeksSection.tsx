import { useState } from "react";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { IEvent, usePatchEvent } from "../../../../../queries/event";
import { OrangeryToast } from "../../../../OrangeryElements";
import { Box, Button, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { EventLogState } from "../HandleLogsRendering";

export default function WeeksSection({
  value,
  onChange,
  state,
  weekValue,
  event,
  handleClose,
  isSelected,
  isDeclined,
}: {
  weekValue: number;
  event: IEvent;
  handleClose: () => void;
  state: EventLogState;
  value: number | null;
  onChange: (value: number | null) => void;
  isSelected: boolean;
  isDeclined: boolean;
}) {
  const handleAccept = (value: number | null) => {
    onChange(value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          backgroundColor: "#F9F9FA",
          borderRadius: "5px",
          p: 1,
        }}
      >
        <Typography flexGrow={1} fontSize={18} fontWeight={400}>
          Weekly &nbsp;&nbsp;{weekValue}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Observer>
            {() => (
              <>
                <Button
                  type="submit"
                  variant="text"
                  onClick={() => handleAccept(weekValue)}
                  sx={{
                    backgroundColor: isSelected ? "#42B863" : "#fff",
                    color: isSelected ? "#fff" : "#42B863",
                    borderRadius: "45px",
                    p: 1,
                    "& .MuiTypography-root": {
                      color: isSelected ? "#fff" : "#42B863",
                    },
                    "&:hover": {
                      backgroundColor: isSelected ? "#42B863" : "#fff",
                      color: isSelected ? "#fff" : "#42B863",
                    },
                  }}
                >
                  <Typography fontSize={13} fontWeight={700}>
                    {isSelected ? "Accepted" : "Accept"}
                  </Typography>
                </Button>
                <Button
                  variant="text"
                  onClick={() => handleAccept(null)}
                  sx={{
                    backgroundColor: isDeclined ? "#FF3D00" : "#fff",
                    color: isDeclined ? "#fff" : "#FF3D00",
                    borderRadius: "45px",
                    p: 1,
                    "& .MuiTypography-root": {
                      color: isDeclined ? "#fff" : "#FF3D00",
                    },
                    "&:hover": {
                      backgroundColor: isDeclined ? "#FF3D00" : "#fff",
                      color: isDeclined ? "#fff" : "#FF3D00",
                    },
                  }}
                >
                  <Typography fontSize={13} fontWeight={700}>
                    {isDeclined ? "Declined" : "Decline"}
                  </Typography>
                </Button>
              </>
            )}
          </Observer>
        </Box>
      </Box>
    </>
  );
}
