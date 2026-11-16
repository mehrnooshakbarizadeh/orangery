import { useState } from "react";
import {
  IEvent,
  IOrganizer,
  IOrganizerEvent,
  IPresenter,
} from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Presenters -{" "}
          <span>{`${event?.presenters?.length} Person${
            event?.presenters?.length! > 1 ? "s" : ""
          }`}</span>
        </Typography>
        {event?.presenters?.map((presenter) => (
          <PresenterInfo key={presenter.uuid} presenter={presenter} />
        ))}
      </Box>
    </>
  );
}

const PresenterInfo = ({ presenter }: { presenter: IPresenter }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {presenter.name}
        </Typography>
        <Typography fontSize={16} fontWeight={600} color="#A5AAB4">
          {presenter.email}
        </Typography>
      </Box>
    </>
  );
};
