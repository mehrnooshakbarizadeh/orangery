// contexts & globals
//

// react & next
import React from "react";

// orangery elements & internal dependencies
import OverviewTab from "./overviewTab/OverviewTab";
import RequestsList from "./requestsTab/RequestsList";
import RentedPropertiesTab from "./rentedPropertiesTab/RentedPropertiesTab";
import OffersList from "./offersTab/OffersList";

// icons, images & colors
import OrangeryRoutedTabs from "../../OrangeryElements/OrangeryRoutedTabs";

export default function TenantsNav() {

  const tabs = [
    {
      slug: 'overview',
      label: "Overview",
      content: <OverviewTab />,
    },
    {
      slug: 'offers',
      label: "Offers",
      content: <OffersList />,
    },
    {
      slug: 'requests',
      label: "Requests",
      content: <RequestsList />,
    },
    {
      slug: 'rented_properties',
      label: "Rented properties",
      content: <RentedPropertiesTab />,
    },
  ];

  return (
    <OrangeryRoutedTabs
      tabs={tabs}
    />
  );
}
