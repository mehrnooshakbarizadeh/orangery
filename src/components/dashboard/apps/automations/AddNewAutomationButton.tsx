// react & next
import React from "react";
import Router from "next/router";
// external dependencies
import { Button, Dialog, DialogContent, Fab, Typography } from "@mui/material";

// orangery elements & internal dependencies


// icons, images & colors
import AddIcon from "@mui/icons-material/Add";

export default function AddNewAutomationButton() {

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => Router.push(`/dashboard/apps/automations/new`)}
        sx={{
          "& .add-btn": { fontSize: 18, fontWeight: 400, color: "#fff" },
          py: "12px",
          px: 5,
          gap: "10px",
        }}
      >
        <Typography className="add-btn">Create an Automation Flow</Typography>
      </Button>
    </>
  );
}
