// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../../src/components/OrangeryElements";

// queries & backend
import { useEmployee } from "../../src/queries/employee";
import { setBackendToken } from "../../src/queries/backend";
import { EmployeeForm } from "../../src/components/dashboard/employees/EmployeeForm";

// others
const TOKEN_KEY = "__token__";

const handleClose = () => {
  window?.postMessage('close', location.origin)
};

const EmployeeEditPage: NextPage = () => {
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

  const { data: employee, isLoading } = useEmployee(officeUuid, query.id);

  let employeeWithOfficeUuid = employee;
  if (employee)
    employeeWithOfficeUuid = {
      ...employee,
      office_uuid: officeUuid
    }

  return <>{isLoading
    ? <OrangeryNavigationContentLoader />
    : employeeWithOfficeUuid && token && token !== ""
      // ? <>here!</>
      ? <EmployeeForm employee={employeeWithOfficeUuid} handleClose={handleClose} noCancel noRemove />
      : "No employee found!"
  }</>;
}

export default EmployeeEditPage