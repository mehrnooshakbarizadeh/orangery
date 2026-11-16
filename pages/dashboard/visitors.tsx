// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// orangery elements & internal dependencies
import VisitorsList from "../../src/components/dashboard/visitors/VisitorsList";

function Visitors() {
  return (
    <>
      <Scaffold>
        <VisitorsList />
      </Scaffold>
    </>
  );
}

export default Visitors;
