// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

// orangery elements & internal dependencies
import FloorForm from "../../src/components/dashboard/floors/FloorForm";
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useFloor } from "../../src/queries/floor";
import { setBackendToken } from "../../src/queries/backend";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const FloorEditPage: NextPage = () => {
  const [token, setToken] = useState("")
  var officeUuid = "";

  const { query } = useRouter();

  if (query.office)
    officeUuid = query.office.toString()

  useEffect(() => {
    setBackendToken(localStorage.getItem(TOKEN_KEY) ?? "")
    setToken(localStorage.getItem(TOKEN_KEY) ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const globalState = useGlobalState();

  useEffect(() => {
    if (officeUuid) {
      if (typeof officeUuid === "string")
        globalState.set_office_uuid(officeUuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeUuid])

  const { data: floor, isLoading } = useFloor(officeUuid, query.id);

  let floorWithOfficeUuid = floor;
  if (floor)
    floorWithOfficeUuid = {
      ...floor,
      office_uuid: officeUuid
    }

  return <>{isLoading
    ? <OrangeryNavigationContentLoader />
    : floorWithOfficeUuid && token && token !== ""
      // ? <>here!</>
      ? <FloorForm floor={floorWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
      : "No floor found!"
  }</>;
}

export default FloorEditPage