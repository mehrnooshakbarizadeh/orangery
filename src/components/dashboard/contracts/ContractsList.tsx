// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import theme from "../../../Contexts & Globals/theme";

// react & next
import React from "react";

// external dependencies
import { Box, Button, Grid, Typography } from "@mui/material";
import DeleteContractButton from "./DeleteContractButton";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import { RentedProductsList } from "../tenants/rentedPropertiesTab/RentedPropertiesTab";
import {
  OrangeryGlobalFilter,
  OrangeryNavigationPlaceholder,
  OrangeryUserCircle,
  OrangeryReadOnlySwitch,
  OrangeryNavigationContentLoader
} from "../../OrangeryElements";

// queries & backend
import { IVisitorType, useVisitors } from "../../../queries/visitor";
import { IContract, useContracts } from "../../../queries/contract";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/meeting_rooms.svg";
import MemoIcon from "../../../assets/svg/memo.svg";
import ArrowDownAZIcon from "../../../assets/svg/arrowDownAZ.svg";
import ArrowUpZAIcon from "../../../assets/svg/arrowUpZA.svg";

export default function ContractsList() {
  const { data: contracts, isLoading, isError } = useContracts();
  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : contracts && contracts.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "start",
            height: "100%",
            minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          {/* <Header /> */}
          <Box
            sx={{
              overflowY: "auto",
              height: "calc(100% - 12px)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
            }}
          >
            {contracts?.map((contract) => (
              <RentedProductsList
                key={contract.product?.uuid}
                deleteButton={
                  contract.product?.one_time_payment ? (
                    <></>
                  ) : (
                    <DeleteContractButton contract={contract} />
                  )
                }
                product={contract}
                noLinkInOverview
              />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          title={"No contracts!"}
          subtitle={"You have no contracts yet."}
          PlaceholderSvg={PlaceholderSvg}
        />
      )}
    </>
  );
}

function Header({ button }: { button?: JSX.Element }) {
  const [desc, setDesc] = React.useState(false);

  const handleSort = () => {
    setDesc(!desc);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          mb: 2,
          flexFlow: {
            sx: "column",
            sm: "row",
          },
        }}
      >
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box sx={{ minWidth: 300, maxWidth: 400 }}>
            <OrangeryGlobalFilter />
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
              py: 1.3,
              px: 1,
              borderRadius: 1,
              flexShrink: 0,
              "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
              "& .sort-button": { minWidth: 46 },
            }}
          >
            <Button onClick={handleSort} className="sort-button">
              {desc ? (
                <ArrowDownAZIcon className="sort-icon" />
              ) : (
                <ArrowUpZAIcon className="sort-icon" />
              )}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            ml: 3,
          }}
        >
          {button}
        </Box>
      </Box>
    </>
  );
}
