import React from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Observer } from "mobx-react-lite";
import { OrangeryText, OrangeryToast } from "../../../OrangeryElements";
import PlusIcon from "../../../../assets/svg/plus.svg";
import CrossIcon from "../../../../assets/svg/cross.svg";
import { IMeetingRoom } from "../../../../queries/meetingRoom";
import { IEventMeetingRoom } from "../../../../queries/event";
import { EventFieldsState, MeetingRoomState, ServiceState } from "../EventForm";
import { IServicePartner } from "../../../../queries/servicePartners";

export default function ServicePartnerRow({
  service,
  state,
  selected,
}: {
  service: IServicePartner;
  state: EventFieldsState;
  selected: boolean;
}) {
  const handleToggle = (serviceP: IServicePartner) => {
    if (
      state.services?.values?.find((m) => m.value.uuid.value === serviceP.uuid)
    ) {
      return;
    }
    state.services?.pushElementValue(
      new ServiceState(service.uuid, "", "", 0, 0, service.name)
    );
    if (service) {
      OrangeryToast("Successfully added " + service.name, "success");
    } else {
      OrangeryToast("Successfully removed from the list " + service, "success");
    }
  };
  return (
    <>
      <Observer>
        {() => (
          <ListItemButton
            onClick={() => handleToggle(service)}
            dense
            sx={{
              flex: "none",
              display: "flex",
              alignItems: "center",
              gap: "70px",
              justifyContent: "space-between",
              py: 2.7,
              px: 2.4,
              boxShadow: "1px 1px 8px #0000000a",
              border: selected
                ? "1px solid #56CA29"
                : "1px solid rgb(210 215 221)",
              borderRadius: 1.5,
              // mb: 1.2,
              mx: 0,
              rowGap: 2,
              fontSize: 16,
              fontWeight: 500,
              "& .column-align": {
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "15%",
              },
            }}
          >
            <ListItemText className="column-align">
              <Typography variant="h6">Service Partner</Typography>
              <Box
                sx={{
                  mr: 2,
                  width: "100%",
                  textAlign: "left",
                  maxWidth: "100%",
                  "& .serial-number": {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              >
                <Typography variant="h4">
                  <OrangeryText text={service.name} limit={10} />
                </Typography>
              </Box>
            </ListItemText>

            <Observer>
              {() => (
                <ListItemIcon
                  sx={{ "& .plus-icon": { width: "1.3rem", height: "1.3rem" } }}
                >
                  {selected && <CrossIcon className="plus-icon" />}
                  {!selected && <PlusIcon className="plus-icon" />}
                </ListItemIcon>
              )}
            </Observer>
          </ListItemButton>
        )}
      </Observer>
    </>
  );
}
