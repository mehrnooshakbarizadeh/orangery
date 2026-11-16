// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryBoxCard,
  OrangeryNavigationContentLoader,
} from "../../OrangeryElements"; ////////!!!!!!!! check retired
import useInterval from "../../../hooks/useInterval";

// queries & backend
// import {
//   IDashboardStatistics,
//   useDashboardStatistics,
// } from "../../../queries/dashboard"; ////////!!!!!!!! retired
import {
  IOverviewReports,
  useOverviewReports,
  useOverviewReportsMutation,
} from "../../../queries/reports";

// icons, images & colors
//

export default function OverviewReports() {
  const { office_uuid, currentUser } = useGlobalState();

  const [overviewReports, setOverviewReports] = React.useState<
    IOverviewReports | undefined
  >(undefined);

  const { data: firstOverviewReports, isLoading } = useOverviewReports({
    office_uuid,
  });

  React.useEffect(() => {
    if (firstOverviewReports) setOverviewReports(firstOverviewReports);
  }, [firstOverviewReports]);

  const overviewReportsMutation = useOverviewReportsMutation();
  async function updateOverviewReports() {
    // if (current_user?.group?.name === "owner")  ////////!!!!!!!! should do with roles/can/ability
    setOverviewReports(
      await overviewReportsMutation.mutateAsync({ office_uuid })
    );
  }

  const [pollingDelay, setPollingDelay] = React.useState(60000);
  const [isRunning, setIsRunning] = React.useState(true);
  useInterval(
    () => {
      updateOverviewReports();
    },
    isRunning ? pollingDelay : null
  );

  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : overviewReports ? (
        <List data={overviewReports} />
      ) : (
        "No statistics is available."
      )}
    </>
  );
}

function List({ data }: { data: IOverviewReports }) {
  const { currentUser } = useGlobalState();
  const globalState = useGlobalState();
  let overviewReports = [
    {
      label: "New Employees",
      value: data.users.value || 0,
      valueNote: `/${data.users.total}`,
      rate: data.users.percentage,
      url: "/dashboard/user-console/",
    },
    ...(!globalState.currentOffice?.is_customer &&
      currentUser?.group?.name !== "front_desk_admin"
      ? [
        {
          label: "New Customers",
          value: data.customers.value || 0,
          valueNote: `/${data.customers.total}`,
          rate: data.customers.percentage,
          url: "/dashboard/customers/",
        },
      ]
      : []),
    {
      label: "Occupancy",
      value: (data.occupancy || 0) + "%",
      // url: "/dashboard/user-console/"
    },
    {
      label: "New Visitors",
      value: data.visitors.value || 0,
      valueNote: `/${data.visitors.total}`,
      rate: data.visitors.percentage,
      url: "/dashboard/visitors/",
    },
    {
      label: "Booked Meeting Rooms",
      value: data.booked_meeting_rooms.value || 0,
      rate: data.booked_meeting_rooms.percentage,
      url: "/dashboard/meeting-room/",
    },
    {
      label: "Booked Parking Spots",
      value: data.booked_parking_spots.value || 0,
      rate: data.booked_parking_spots.percentage,
      url: "/dashboard/parking-spot/",
    },
    {
      label: "Free Desks",
      value: data.free_desks,
      valueNote: `/${data.total_desks}`,
      url: "/dashboard/desks/",
    },
    {
      label: "Assets in Use",
      value: data.assets_in_use,
      valueNote: `/${data.total_assets}`,
      url: "/dashboard/inventory/",
    },
  ];

  {
    /* <OrangeryBoxCard icon={<MoneyIcon />} label={"Sales"} value={"€ 5420"} /> */
  }

  return (
    <Box
      sx={{
        flexFlow:
          currentUser?.group?.name === "front_desk_admin" ? "nowrap" : "wrap",
        backgroundColor: "transparent",
        // borderRadius: 2.5,
        width: "100%",
        display: "flex",
        flexDirection:
          currentUser?.group?.name === "front_desk_admin" ? "column" : "row",
        gap: 2,
        // height: "calc(100vh - 50px)",
        overflowY: "auto",
        height: "100%",
        "&::-webkit-scrollbar": {
          width: "0.3em",
        },
        "&::-webkit-scrollbar-track": {
          // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          // outline: "1px solid slategrey",
          borderRadius: 5,
        },
      }}
    >
      {overviewReports.map((item) => (
        <Box
          key={item.label}
          sx={{
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
            },
            flex: 0,
          }}
        >
          <OrangeryBoxCard item={item} />
        </Box>
      ))}
    </Box>
  );
}
