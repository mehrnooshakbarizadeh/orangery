// react & next
import React, { useState } from "react";

import PlaceholderSvg from "../../../assets/svg/placeholders/media.svg";
import DownloadIcon from "../../../assets/svg/download.svg";

// external dependencies
import { Box, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";

//
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryMediaCard
} from "../../OrangeryElements";
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { useMedias } from "../../../queries/media";

export default function MediaList() {
  const globalState = useGlobalState();
  const { data: medias, isLoading } = useMedias(globalState.office_uuid);
  return (
    <>
      {isLoading ? (
        <OrangeryNavigationContentLoader />
      ) : medias && medias.length > 0 ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 666,
            borderRadius: 1.5,
            py: 3,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              px: 1,
              flexBasis: "fit-content",
              overflowY: "auto",
              height: "calc(100vh - 72px)",
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
            <Observer>
              {() => (
                <>
                  {medias?.map((media) => (
                    <OrangeryMediaCard key={media.uuid} media={media} />
                  ))}
                </>
              )}
            </Observer>
          </Box>
        </Box>
      ) : (
        <OrangeryNavigationPlaceholder
          vertical
          width={376}
          height={323}
          title={"No Media Files!"}
          subtitle={"You have not uploaded any file."}
          PlaceholderSvg={PlaceholderSvg}
          AddNewButton={<></>}
          addNewButtonText={""}
        />
      )}
    </>
  );
}