// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryToast,
  OrangeryFormWrapper
} from "../../../OrangeryElements";

// queries & backend
import {
  useDeleteTransaction,
} from "../../../../queries/apps/osAnalytics";

export default function TransactionRemoveForm({
  transaction,
  handleClose,
}: {
  transaction: any;
  handleClose?: () => void;
}) {
  const mutation = useDeleteTransaction();

  const handleDelete = async () => {
    await mutation.mutateAsync({
      uuids: [transaction.uuid],
    });

    OrangeryToast("Deleted " + transaction.name, "warning");

    if (handleClose)
      handleClose();
  };

  return (
    <OrangeryFormWrapper
      title={`Remove ${transaction.name}`}
      onClose={handleClose}
      withBorder
      style={{
        width: 601,
        height: 395
      }}
      footer={<Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            ml: "auto"
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "grey.200",
              color: "grey.A200",
              fontSize: 21,
              fontWeight: 400,
              flexGrow: 1,
              width: 170,
              height: 55,
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{
              fontSize: 21,
              fontWeight: 400,
              color: "#fff",
              width: 170,
              height: 55,
            }}
            onClick={handleDelete}
          >
            Yes, Remove it
          </Button>
        </Box>
      </Box>
      }
    >
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          my: "auto",
          pb: 3,
          px: 3,
          pt: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Are you sure removing this transaction?
        </Typography>
      </Box>
    </OrangeryFormWrapper>
  );
}
