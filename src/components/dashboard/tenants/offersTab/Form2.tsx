// react & next
import React from "react";

// external dependencies
import { Box, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import HandleSelectedItem from "./showSelectedItems/HandleSelectedItem";
import HandleAssetFieldSelector from "./addAsset/HandleAssetFieldSelector";
import { OfferFieldsState } from "./HandleOfferForm";
import HandleDeskFieldSelector from "./addDesk/HandleDeskFieldSelector";
import HandleRoomFieldSelector from "./addRoom/HandleRoomFieldSelector";

export default function Form2({ state }: { state: OfferFieldsState }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "& .line-heigh": { mb: 8 },
        }}
      >
        <Typography variant="h1">Include items (optional)</Typography>
        <Typography variant="h3" className="line-heigh">
          You can customize your offer from hundreds of items.
        </Typography>
        <Typography variant="h2">Select your options:</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2 }}>
          <Observer>{() => <HandleDeskFieldSelector state={state} />}</Observer>
          <Observer>
            {() => <HandleAssetFieldSelector state={state} />}
          </Observer>
          {state.product_type.value !== "cube" && (
            <Observer>
              {() => <HandleRoomFieldSelector state={state} />}
            </Observer>
          )}
        </Box>
        <Observer>
          {() => (
            <>
              {(state.desks.values.length > 0 ||
                state.assets.values.length > 0 ||
                state.room_uuids.values.length > 0) && (
                <HandleSelectedItem state={state} />
              )}
            </>
          )}
        </Observer>
      </Box>
    </>
  );
}
