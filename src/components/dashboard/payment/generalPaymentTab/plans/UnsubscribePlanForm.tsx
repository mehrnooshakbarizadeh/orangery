// contexts & globals
import { useGlobalState } from "../../../../../Contexts & Globals/GlobalContext";

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import { Box, Button } from "@mui/material";
import { makeAutoObservable } from "mobx";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
} from "../../../../../states/mobx-form";
import { OrangeryToast } from "../../../../OrangeryElements";

// queries & backend
import { IPlanParams, useDeletePlan } from "../../../../../queries/plan";

// icons, images & colors
import CapacityIcon from "../../../../../assets/svg/capacity.svg";

export class PlanState {
  public uuid;
  public error = "";

  constructor(plan?: IPlanParams) {
    if (plan) {
      this.uuid = new ValueState(plan.uuid);
    } else {
      this.uuid = new ValueState("");
    }

    makeAutoObservable(this);
  }

  get data() {
    return {
      uuid: this.uuid.value,
    };
  }

  clearErrors() {
    this.uuid.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();

    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in PlanForm.`
      // );
    }
  }
}

export default function PlanForm({ plan }: { plan?: IPlanParams }) {
  const { office_uuid } = useGlobalState();
  const mutation = useDeletePlan();
  const state = React.useMemo(() => new PlanState(plan), [, plan]);
  const globalState = useGlobalState();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);
      OrangeryToast("Successfully unsubscribed", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={mutation.isLoading}
          sx={{
            width: "100%",
            height: 55,
            fontSize: 20,
            color: "#fff",
          }}
        >
          UNSUBSCRIBE
        </Button>
      </Box>
    </form>
  );
}
