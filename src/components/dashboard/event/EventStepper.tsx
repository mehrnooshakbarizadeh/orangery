import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { Observer } from "mobx-react-lite";
import { EventFieldsState } from "./EventForm";

let steps = [
  "Event Details",
  "Add Meeting Room, Assets and Services",
  "Organizer, Presenter,and Attendees",
  "Images",
  "Summery",
];

export default function EventStepper({
  state,
  activeStep,
}: {
  state: EventFieldsState;
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
                  completed={completed[index]}
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
    </Box>
  );
}
