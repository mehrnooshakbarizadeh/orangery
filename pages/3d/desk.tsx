// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import React from "react"

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useDesk } from "../../src/queries/desk";
import { setBackendToken } from "../../src/queries/backend";
import { DeskForm } from "../../src/components/dashboard/desks/DeskForm";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const DeskEditPage: NextPage = () => {
  const [token, setToken] = React.useState("")
  const [officeUuid, setOfficeUuid] = React.useState("")
  const [deskUuid, setDeskUuid] = React.useState("")

  const { query } = useRouter();

  React.useEffect(() => {
    if (query.office)
      setOfficeUuid(query.office.toString())
    if (query.id)
      setDeskUuid(query.id.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.office, query.id])

  React.useEffect(() => {
    setBackendToken(localStorage.getItem(TOKEN_KEY) ?? "")
    setToken(localStorage.getItem(TOKEN_KEY) ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const globalState = useGlobalState();

  React.useEffect(() => {
    if (officeUuid) {
      if (typeof officeUuid === "string")
        globalState.set_office_uuid(officeUuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeUuid])

  const { data: desk, isLoading } = useDesk(officeUuid, deskUuid);

  let deskWithOfficeUuid = desk;
  if (desk)
    deskWithOfficeUuid = {
      ...desk,
      office_uuid: officeUuid
    }

  return <>{
    token && token !== ""
      ? officeUuid
        ? deskUuid
          ? isLoading
            ? <OrangeryNavigationContentLoader />
            : deskWithOfficeUuid
              // ? <>here!</>
              ? <DeskForm desk={deskWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
              : "No desk found!"
          : "" // "No desk id!"
        : "" // "No office id!"
      : "" // "No token!"
  }</>;
}

export default DeskEditPage