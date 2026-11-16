// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";
// external dependencies
import { Box, Button, Typography } from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryNavigationPlaceholder,
  // OrangeryNavigationContentLoader,
  OrangeryAppAvatar,
  OrangeryPrice,
} from "../../OrangeryElements";
import AppConnectionButton from "./AppConnectionButton";
import AppEditButton from "./AppEditButton";
import AppDisconnectionButton from "./AppDisconnectionButton";

// queries & backend
import { IApp } from "../../../queries/apps";

// icons, images & colors
import PlaceholderSvg from "../../../assets/svg/placeholders/desks2.svg";
import GoogleSyncButton from "./googleAdminResource/GoogleSyncButton";
import GoogleAdminUsersSyncButton from "./googleAdminUsers/GoogleAdminUsersSyncButton";
import HubSpotContactsListButton from "./hubSpot/HubSpotContactsListButton";

export default function AppsList() {
  const { apps } = useGlobalState();
  // const {
  //   data: apps,
  //   isLoading,
  //   isError,
  // } = useApps();

  return (
    <>
      {apps && apps.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: 666,
            borderRadius: 1.5,
            py: 4,
            px: 2,
            "& .scroll-align": {
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
            },
          }}
        >
          <Box
            sx={{
              flexFlow: "wrap",
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
              gap: 3,
              px: 2,
              alignContent: "baseline",
              // "& > * + *": {
              //   ml: 3
              // }
            }}
          >
            {apps?.map((app: any) => (
              <AppCard key={app.uuid} app={app} />
            ))}
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          vertical
          width={213}
          height={224}
          title={"No Apps!"}
          subtitle={""}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
      )}
    </>
  );
}

function AppCard({ app }: { app: IApp }) {


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 4,
        width: 400,
        minHeight: 270,
        height: 320,
        backgroundColor: "#F9F9FA",
        borderRadius: "15px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            top: 16,
            right: 30,
            "> * + *": {
              borderLeft: "1px solid #C9CCD2",
            },
          }}
        >
          {app.integrated && <AppEditButton app={app} />}
          {app.integrated && <AppDisconnectionButton app={app} />}
        </Box>

        <OrangeryAppAvatar
          name={app.name}
          fileName={app.image ?? ""}
          size={80}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {app.name}
          </Typography>
          <Typography>{app.description}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        {app.uuid === "c11073a2-0e6d-486a-97e5-739c1cd34f95" &&
          app.integrated && <HubSpotContactsListButton />
        }
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {app.price && false ? (
            <OrangeryPrice euro={app.price} germanFormat />
          ) : (
            ""
          )}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          {app.uuid === "e77fc557-d50a-407c-8b68-e5ca70a55879" &&
            app.integrated && <GoogleSyncButton />}
          {app.uuid === "2e279a33-f6f8-40bb-892e-6da9a4c471eb" &&
            app.integrated && <GoogleAdminUsersSyncButton />}
          {app.integrated ? (
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              CONNECTED
            </Typography>
          ) : (
            <AppConnectionButton app={app} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
