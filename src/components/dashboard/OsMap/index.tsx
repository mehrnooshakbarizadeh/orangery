// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import getConfig from "next/config";

// react & next
import React from "react";

// external dependencies
import { Box } from "@mui/system";

// others
const { publicRuntimeConfig } = getConfig();
const os3dpath = publicRuntimeConfig.path + "/os3d/index.htm";

export default function OsMapNav() {
  const globalState = useGlobalState();

  return (<>
    {globalState.office_uuid
      ? <Box
        id="a3dcontainer"
        sx={{
          display: "flex",
          border: 0,
          padding: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "auto",
          top: 120,
          bottom: 0,
        }}
      >
        <iframe
          frameBorder="no-border"
          width="100%"
          height="100%"
          src={os3dpath + "?" + globalState.office_uuid}
        />
      </Box>
      : <>No office is available.</>
    }
  </>);
}
