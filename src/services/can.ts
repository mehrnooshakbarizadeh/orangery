// contexts & globals
import { AppAbility } from "./ability";

// react & next
import { createContext } from "react";

// external dependencies
import { createContextualCan } from "@casl/react";

export const AbilityContext = createContext<AppAbility>(undefined!);

export default createContextualCan(AbilityContext.Consumer);
