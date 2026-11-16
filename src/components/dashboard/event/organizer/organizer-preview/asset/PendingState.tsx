import { useState } from "react";
import {
  IAsset,
  IEvent,
  IMeetingRoom,
  IOrganizerEvent,
} from "../../../../../../queries/event";
import { OrangeryCarousel } from "../../../../../OrangeryElements";
import { Box, Typography } from "@mui/material";
import { OrganizerEventFieldsState } from "../OrganizerReviewPage";

export default function PendingState({ event }: { event: IOrganizerEvent }) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography fontSize={20} fontWeight={600} color="#A5AAB4">
          Assets
        </Typography>
        {event?.assets?.map((asset) => (
          <AssetInfo key={asset.uuid} asset={asset} />
        ))}
      </Box>
    </>
  );
}

const AssetInfo = ({ asset }: { asset: IAsset }) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontSize={19} fontWeight={600} color="#55585C">
          {asset.grouped_name}
        </Typography>
      </Box>
    </>
  );
};
