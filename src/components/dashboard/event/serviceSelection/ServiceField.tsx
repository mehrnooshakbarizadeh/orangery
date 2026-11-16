import { Box, IconButton, Typography } from "@mui/material";
import { Observer } from "mobx-react-lite";
import { useState } from "react";
import AngleDownIcon from "../../../../assets/svg/angleDown.svg";
import AngleUpIcon from "../../../../assets/svg/angleUp.svg";
import { EventFieldsState } from "../EventForm";
import HandleServiceSelector from "./HandleServiceSelector";
import ServicesList from "./ServicesList";

export default function ServiceField({ state }: { state: EventFieldsState }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            pt: 4,
          }}
        >
          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexGrow: 1,
                  }}
                >
                  <Typography fontSize={24} fontWeight={700}>
                    Service
                    {state.services.values?.length > 1 ? "s" : ""}{" "}
                    {state.services.values?.length > 0
                      ? state.services.values?.length
                      : ""}
                  </Typography>
                  <IconButton
                    onClick={handleToggle}
                    sx={{
                      display: !state.services.values?.length
                        ? "none"
                        : "block",
                      "& .action-icon": {
                        width: "1.3rem",
                        height: "1.3rem",
                        cursor: "pointer",
                        color: "#000",
                      },
                    }}
                  >
                    {!open ? (
                      <AngleDownIcon className="action-icon" />
                    ) : (
                      <AngleUpIcon className="action-icon" />
                    )}
                  </IconButton>
                </Box>
              </>
            )}
          </Observer>
          <Observer>{() => <HandleServiceSelector state={state} />}</Observer>
        </Box>
        <Observer>{() => <ServicesList open={open} state={state} />}</Observer>
      </form>
    </>
  );
}
