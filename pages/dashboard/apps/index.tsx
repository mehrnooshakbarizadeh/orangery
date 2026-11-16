// contexts & globals
import Scaffold from "../../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import AppsList from "../../../src/components/dashboard/apps/AppsList";

function Apps() {
  return (
    <>
      <Scaffold>
        <AppsList />
      </Scaffold>
    </>
  );
}

export default Apps;
