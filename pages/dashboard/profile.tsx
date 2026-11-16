// contexts & globals
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// react & next
import React from "react";

// orangery elements & internal dependencies
import ProfileNav from "../../src/components/dashboard/profile/ProfileNav";

function Profile() {
  const globalState = useGlobalState();
  React.useEffect(() => {
    globalState.set_current_page_header("Profile");
    globalState.setCurrentSubject("Profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Scaffold>
        <ProfileNav />
      </Scaffold>
    </>
  );
}

export default Profile;
