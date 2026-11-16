// contexts & globals
import Scaffold from "../../src/components/dashboard/_components/Scaffold";

// react & next
import { useEffect } from "react"

// orangery elements & internal dependencies
import OsMapNav from "../../src/components/dashboard/OsMap";

function ThreeDView() {
  useEffect(() => {
    localStorage.setItem("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL!);
  }, [])

  return (
    <>
      <Scaffold>
        <OsMapNav />
      </Scaffold>
    </>
  );
}

export default ThreeDView;
