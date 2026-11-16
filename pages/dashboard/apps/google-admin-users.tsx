// contexts & globals
import Scaffold from "../../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import GoogleUsersImportForm from "../../../src/components/dashboard/apps/googleAdminUsers/GoogleUsersImportForm";

function GoogleAdminUsers() {
  return (
    <>
      <Scaffold withoutHeader={true}>
        <GoogleUsersImportForm />
      </Scaffold>
    </>
  );
}

export default GoogleAdminUsers;
