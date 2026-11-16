// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import HelpDeskNav from "../../src/components/dashboard/helpDesk/HelpDeskNav";

function HelpDesk() {
  return (
    <>
      <Scaffold>
        <HelpDeskNav />
      </Scaffold>
    </>
  );
}

export default HelpDesk;
