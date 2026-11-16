// contexts & globals
import Scaffold from "../../../src/components/dashboard/_components/Scaffold";

//
import React from "react";

// orangery elements & internal dependencies
import OsAnalyticsNav from "../../../src/components/dashboard/apps/osAnalytics";

function OsAnalytics() {
  return (
    <>
      <Scaffold withoutHeader={true}>
        <OsAnalyticsNav />
      </Scaffold>
    </>
  );
}

export default OsAnalytics;
