// contexts & globals
import { useGlobalState } from "../../Contexts & Globals/GlobalContext";
import NoSsr from "../../Contexts & Globals/NoSsr";
import { Gateway } from "../../Contexts & Globals/Gateway";

// react & next
import React from "react";

export default function AuthScaffold({
  children
}: {
  children: React.ReactNode;
}) {
  const globalState = useGlobalState();
  return (
    <>
      <NoSsr><Gateway /></NoSsr>
      {children}
    </>
  );
}
