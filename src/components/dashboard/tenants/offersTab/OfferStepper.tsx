// react & next
import React from "react";

// external dependencies
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

// orangery elements & internal dependencies
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form1 from "./Form1";
import { OfferFieldsState } from "./HandleOfferForm";

// queries & backend
import { IOffer } from "../../../../queries/tenant";
import { Observer } from "mobx-react-lite";
import { OrangerySwitch } from "../../../OrangeryElements";
import { StepLabel, Typography } from "@mui/material";
import SidebarSwitchs from "./SidebarSwitchs";

let steps = ["Initial Setup", "Include Items", "Payment Details"];
let mobilitySteps = ["Initial Setup", "Payment Details"];

export default function OfferStepper({
  state,
  activeStep,
  mobilityState,
  mobilityProduct,
}: {
  mobilityProduct: string;
  mobilityState: boolean;
  state: OfferFieldsState;
  activeStep: number;
}) {
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const handleStep = (step: number) => () => {
    if (step === 1) {
      return;
    } else state.setActiveStep(step);
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& .stepper-area": {
          "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": { mt: 1 },
          "& .MuiStepIcon-root": { color: "black" },
          "& .MuiStepIcon-root.Mui-active": { color: "#F9D507" },
          "& .MuiStepIcon-root.Mui-completed": { color: "green" },
          "&.MuiStepIcon-root.Mui-disabled": { color: "#e3e3e3" },
          "& .MuiStepIcon-text": { fontWeight: 800 },
        },
      }}
    >
      {mobilityState || mobilityProduct === "mobility" ? (
        <Observer>
          {() => (
            <>
              <Stepper
                activeStep={activeStep}
                // orientation="vertical"
                className="stepper-area"
                alternativeLabel
              >
                {mobilitySteps.map((label, index) => (
                  <Step
                    key={label}
                    completed={
                      index === 1 && state.product_type.value === "mobility"
                        ? false
                        : completed[index]
                    }
                    sx={{
                      ".MuiStepConnector-line": {
                        height: "168px !important",
                      },
                    }}
                  >
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </>
          )}
        </Observer>
      ) : (
        <Observer>
          {() => (
            <>
              <Stepper
                activeStep={activeStep}
                // orientation="vertical"
                className="stepper-area"
                alternativeLabel
              >
                {steps.map((label, index) => (
                  <Step
                    key={label}
                    completed={
                      index === 1 && state.product_type.value === "mobility"
                        ? false
                        : completed[index]
                    }
                    sx={{
                      ".MuiStepConnector-line": {
                        height: "168px !important",
                      },
                    }}
                  >
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </>
          )}
        </Observer>
      )}
    </Box>
  );
}
