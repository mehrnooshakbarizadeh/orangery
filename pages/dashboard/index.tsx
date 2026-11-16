// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import OverviewNav from "../../src/components/dashboard/overview";

function DashboardPage() {
  return (
    <>
      <Scaffold>
        <OverviewNav />
      </Scaffold>
    </>
  );
}

export default DashboardPage;
