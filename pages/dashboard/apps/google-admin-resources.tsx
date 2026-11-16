// contexts & globals
import Scaffold from "../../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import GoogleAdminNav from "../../../src/components/dashboard/apps/googleAdminResource/GoogleAdminNav";

function GoogleAdminResources() {
  return (
    <>
      <Scaffold withoutHeader={true}>
        <GoogleAdminNav />
      </Scaffold>
    </>
  );
}

export default GoogleAdminResources;
