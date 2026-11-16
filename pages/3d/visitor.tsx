// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

// orangery elements & internal dependencies
import VisitorForm from "../../src/components/dashboard/visitors/VisitorForm";
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useVisitor } from "../../src/queries/visitor";
import { setBackendToken } from "../../src/queries/backend";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const VisitorEditPage: NextPage = () => {
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

  const { data: visitor, isLoading } = useVisitor(officeUuid, query.id);

  let visitorWithOfficeUuid = visitor;
  if (visitor)
    visitorWithOfficeUuid = {
      ...visitor,
      office_uuid: officeUuid
    }

  return <>{isLoading
    ? <OrangeryNavigationContentLoader />
    : visitorWithOfficeUuid && token && token !== ""
      // ? <>here!</>
      ? <VisitorForm visitor={visitorWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
      : "No visitor found!"
  }</>;
}

export default VisitorEditPage