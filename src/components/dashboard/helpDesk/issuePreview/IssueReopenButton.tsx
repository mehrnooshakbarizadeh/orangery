// contexts & globals
//

// react & next
import React from "react";

// external dependencies
import {
  Button,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryToast,
} from "../../../OrangeryElements";

// queries & backend
import {
  IIssue,
  useUpdateIssue
} from "../../../../queries/issue";
import { processError } from "../../../../queries/commons";

// icons, images & colors
//

export default function IssueReopenButton({
  selectedIssue,
}: {
  selectedIssue: IIssue;
}) {
  const updateIssueMutation = useUpdateIssue();

  async function handleOpenIssue(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateIssueMutation.mutateAsync({
        issue_uuid: selectedIssue.uuid,
        active: true,
      });
      OrangeryToast("Successfully opened.", "success");
    } catch (err: any) {
      const processedError = processError(err);
      throw processedError;
    }
  }

  return (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      onClick={handleOpenIssue}
      disabled={updateIssueMutation.isLoading}
      sx={{
        width: {
          xs: "100%",
          sm: 170,
        },
        height: 44,
        fontSize: 20,
        color: "#fff",
      }}
    >
      Reopen Issue
    </Button>
  );
}