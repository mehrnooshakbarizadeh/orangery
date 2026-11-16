import { useState } from "react";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import { IEvent, usePatchEvent } from "../../../../../queries/event";
import { OrangeryToast } from "../../../../OrangeryElements";
import { Box, Button, Typography } from "@mui/material";
import { EventLogState } from "../HandleLogsRendering";
import { Observer } from "mobx-react-lite";

export default function NameSection({
  nameValue,
  event,
  handleClose,
  value,
  state,
  onChange,
  isSelected,
  isDeclined,
}: {
  nameValue: string;
  event: IEvent;
  handleClose: () => void;
  state: EventLogState;
  value: string | null;
  onChange: (value: string | null) => void;
  isSelected: boolean;
  isDeclined: boolean;
}) {
  const handleAccept = (value: string | null) => {
    onChange(value);
  };

  return (
    <>
      <Observer>
        {() => (
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
            <Typography flexGrow={1}>{nameValue}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                type="submit"
                variant="text"
                onClick={() => handleAccept(nameValue)}
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
                <Typography color="#42B863" fontSize={13} fontWeight={700}>
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
                <Typography color="#FF3D00" fontSize={13} fontWeight={700}>
                  {isDeclined ? "Declined" : "Decline"}
                </Typography>
              </Button>
            </Box>
          </Box>
        )}
      </Observer>
    </>
  );
}
