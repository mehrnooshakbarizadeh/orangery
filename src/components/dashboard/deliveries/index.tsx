// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

// orangery elements & internal dependencies
import DeliveryLogsTab from "./deliveryLogsTab"
import DeliveryAreasTab from "./deliveryAreasTab"
import {
  OrangeryFormButton,
  OrangeryRoutedTabs
} from "../../OrangeryElements";

// queries & backend
import {
  useDeliveryAreas
} from "../../../queries/delivery";
import DeliveryAreaForm from "./deliveryAreasTab/DeliveryAreaForm";

export default function DeliveriesNav() {
  React.useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor = "white"
  }, []);

  const globalState = useGlobalState();

  const {
    data: deliveryAreas,
    isLoading: deliveryAreasIsLoading
  } = useDeliveryAreas(globalState.office_uuid);

  const tabs = [
    {
      slug: 'delivery_logs',
      label: "Delivery Logs",
      content: <DeliveryLogsTab />
    },
    {
      slug: 'delivery_areas',
      label: "Delivery Areas",
      content: <DeliveryAreasTab deliveryAreas={deliveryAreas} isLoading={deliveryAreasIsLoading} />,
      ...(deliveryAreas && deliveryAreas.length > 0
        ? {
          button: <Box
            sx={{
              top: -4,
              position: "absolute",
              width: "fit-content",
              right: 0,
              zIndex: 20
            }}
          >
            <OrangeryFormButton
              variant="add"
              Form={<DeliveryAreaForm />}
              caption="Add Area"
              size="medium"
            />
          </Box>
        }
        : {}
      )
    },
  ]

  return (
    <OrangeryRoutedTabs
      tabs={tabs}
    />
    //   : <OrangeryNavigationPlaceholder
    //   title={"Build a rental community"}
    //   subtitle={"Valuate the company's assets by renting them during unused hours."}
    //   PlaceholderSvg={PlaceholderSvg}
    //   AddNewButton={<AddNewButton />}
    //   addNewButtonText={""}
    // />
  );
}