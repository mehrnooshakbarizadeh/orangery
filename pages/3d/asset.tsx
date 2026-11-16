// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

// orangery elements & internal dependencies
import AssetForm from "../../src/components/dashboard/assets/AssetForm";
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useAsset } from "../../src/queries/asset";
import { setBackendToken } from "../../src/queries/backend";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const AssetEditPage: NextPage = () => {
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

  const { data: asset, isLoading } = useAsset(officeUuid, query.id);

  let assetWithOfficeUuid = asset;
  // if (asset)
  //   assetWithOfficeUuid = {
  //     ...asset,
  //     office_uuid: officeUuid
  //   }

  return <>{isLoading
    ? <OrangeryNavigationContentLoader />
    : assetWithOfficeUuid && token && token !== ""
      // ? <>here!</>
      ? <AssetForm asset={assetWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
      : "No asset found!"
  }</>;
}

export default AssetEditPage