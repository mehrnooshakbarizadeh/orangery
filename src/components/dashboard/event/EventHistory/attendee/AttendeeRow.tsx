import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";
import {
  IAttendee,
  IOrganizer,
  IPerson,
  IPresenter,
} from "../../../../../queries/event";
import { Box, Button, Typography } from "@mui/material";
import OrganizerInfo from "../OrganizersInfo";
import { Observer } from "mobx-react-lite";
import { AttendeeLogState } from "./EditForm";

export default function AttendeeRow({
  state,
  value,
  onChange,
  attendee,
  isSelected,
  isDeclined,
}: {
  state: AttendeeLogState;
  value: string | null;
  onChange: (newValue: string | null) => void;
  attendee: IPresenter | IOrganizer | IAttendee | IPerson;
  isSelected: boolean;
  isDeclined: boolean;
}) {
  const handleAccept = () => {
    onChange(attendee.uuid);
    state.setAccepted(true);
  };
  const handleDecline = () => {
    onChange(null);
    state.setAccepted(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          position: "relative",
          width: "100%",
          p: 2,
          backgroundColor: "#F9F9FA",
        }}
      >
        <OrganizerInfo person={attendee} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            right: "8px",
            top: "18px",
          }}
        >
          <Observer>
            {() => (
              <Button
                variant="text"
                onClick={() => handleAccept()}
                sx={{
                  backgroundColor: isSelected ? "#42B863" : "#fff",
                  color: isSelected ? "#fff" : "#42B863",
                  borderRadius: "45px",
                  p: 0.3,
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
            )}
          </Observer>
          <Observer>
            {() => (
              <Button
                variant="text"
                onClick={() => handleDecline()}
                sx={{
                  backgroundColor: isDeclined ? "#FF3D00" : "#fff",
                  color: isDeclined ? "#fff" : "#FF3D00",
                  borderRadius: "45px",
                  p: 0.3,
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
            )}
          </Observer>
        </Box>
      </Box>
    </>
  );
}
