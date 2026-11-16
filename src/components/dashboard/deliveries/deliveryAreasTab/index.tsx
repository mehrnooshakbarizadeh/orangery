// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box, Grid, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryFormButton,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
} from "../../../OrangeryElements";

// queries & backend
import {
  IDeliveryArea
} from "../../../../queries/delivery";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import DeliveryAreaForm from "./DeliveryAreaForm";
import DeliveryAreaRemoveForm from "./DeliveryAreaRemoveForm";

export default function DeliveryAreasTab({
  deliveryAreas,
  isLoading,
}: {
  deliveryAreas?: IDeliveryArea[];
  isLoading?: boolean
}) {
  const globalState = useGlobalState();

  return <>{isLoading
    ? <OrangeryNavigationContentLoader />
    : deliveryAreas && deliveryAreas.length > 0
      ? <List data={deliveryAreas} />
      : <OrangeryNavigationPlaceholder
        title={"No delivery area!"}
        subtitle={"No delivery area is available."}
        PlaceholderSvg={PlaceholderSvg}
        width={314}
        height={330}
        AddNewButton={<OrangeryFormButton
          variant="add"
          Form={<DeliveryAreaForm />}
          caption="Add Area"
          size="large"
        />}
      />
  }</>;
}

function List({ data }: { data: IDeliveryArea[] }) {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
      }}
    >
      <Box
        sx={{
          flexFlow: "wrap",
          alignContent: "baseline",
          display: "flex",
          height: "100%",
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
          // "& > * + *": {
          //   ml: 3
          // }
        }}>
        <Grid container> {/* height="100%" */}
          {data.map((deliveryArea) => (
            <Grid xs={12} sm={12} md={6} xl={3}
              item
              key={deliveryArea.uuid}
            >
              <DeliveryAreaCard
                deliveryArea={deliveryArea}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function DeliveryAreaCard({
  deliveryArea
}: {
  deliveryArea: IDeliveryArea
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "8px",
        position: "relative",
        flex: 1,
        height: 90,
        px: 3,
        m: .5
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: .5,
          // width: {
          //   xs: "65%",
          //   md: "57%",
          //   xl: "50%"
          // }
          width: "calc(100% - 166px)"
        }}
      >
        <Typography variant="h6">Location name</Typography>
        <Typography
          variant="h4"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {deliveryArea.name}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          ml: "auto",
          gap: 2,
          flexShrink: 0
        }}
      >
        <OrangeryFormButton
          variant="edit"
          Form={<DeliveryAreaForm deliveryArea={deliveryArea} />}
        />

        <OrangeryFormButton
          variant="remove"
          Form={<DeliveryAreaRemoveForm deliveryArea={deliveryArea} />}
          caption
        />
      </Box>
    </Box>
  )
}