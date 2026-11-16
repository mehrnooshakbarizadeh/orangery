// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  OrangeryUserCircle,
  OrangeryToast,
  OrangeryTextAreaField,
  OrangeryImagesPdfField
} from "../../../OrangeryElements";
import { ArrayValueState, FieldError, FormError, ValueState } from "../../../../states/mobx-form";

// queries & backend
import {
  IIssue,
  IComment,
  useComments,
  useCommentIssue
} from "../../../../queries/issue";

// icons, images & colors
//

export class CommentFormState {
  public office_uuid;
  public issue_uuid;

  public image_uuids;
  public description;

  public error = "";

  constructor(office_uuid: string, issue_uuid: string) {
    this.office_uuid = new ValueState(office_uuid);
    this.issue_uuid = new ValueState(issue_uuid);

    this.image_uuids = new ArrayValueState<string>([]);
    this.description = new ValueState<string>("");

    makeAutoObservable(this);
  }

  get data() {
    return {
      office_uuid: this.office_uuid.value,
      issue_uuid: this.issue_uuid.value,

      image_uuids: this.image_uuids.values.map((v) => v.value),
      description: this.description.value,
    };
  }

  clearErrors() {
    this.image_uuids.clearError();
    this.description.clearError();

    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.description.value) {
      this.description.error = "Please fill your comment";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "description") {
      this.description.error = error.error;
    } else {
      // console.warn(
      //   `the field ${error.field} not found in the field list in DeskForm.`
      // );
    }
  }
}

export default function CommentForm({
  selectedIssue,
  showUser
}: {
  selectedIssue: IIssue;
  showUser?: boolean
}) {
  const { office_uuid, currentUser } = useGlobalState();
  const mutation = useCommentIssue();
  const state = React.useMemo(
    () => new CommentFormState(office_uuid, selectedIssue.uuid ?? ""),
    [office_uuid, selectedIssue]
  );
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.validate()) {
      return;
    }
    try {
      await mutation.mutateAsync(state.data);

      OrangeryToast("Successfully sent", "success");
    } catch (err: any) {
      state.setupErrors(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        {showUser &&
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <OrangeryUserCircle
              name={currentUser?.name ?? currentUser?.first_name + " " + currentUser?.last_name}
              fileName={currentUser?.image_uuid || ""}
              size={35}
              notHoverable
              noMargin
            />
            <Typography
              variant="subtitle2"
              sx={{
                mb: .5
                // mb: 1
              }}
            >
              {currentUser?.name ?? currentUser?.first_name + " " + currentUser?.last_name}
            </Typography>
          </Box>
        }

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <Box sx={{ width: "100%" }}>
            <Observer>
              {() => (
                <OrangeryTextAreaField
                  sx={{
                    height: "80px",
                    mb: 3,
                  }}
                  label="Comment"
                  name="description"
                  multiline
                  placeholder="Type comment..."
                  error={!!state.description.error}
                  value={state.description.value}
                  helperText={state.description.error}
                  onChange={(e: any) =>
                    (state.description.value = e.target.value)
                  }
                />
              )}
            </Observer>
          </Box>
        </Box>

        <Box sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row"
          },
          gap: 1
        }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "50%",
              }
            }}
          >
            <Observer>
              {() => (
                <OrangeryImagesPdfField
                  // caption="Attachments"
                  images={state.image_uuids.values.map((v) => v.value)}
                  onAdd={(uuid) => state.image_uuids.pushElementValue(uuid)}
                  onRemove={(uuid) => {
                    const i = state.image_uuids.values.findIndex(
                      (v) => v.value === uuid
                    );
                    if (i !== -1) {
                      state.image_uuids.deleteElementValue(i);
                    }
                  }}
                />
              )}
            </Observer>
          </Box>
          <Box
            sx={{
              ml: {
                xs: 0,
                sm: "auto"
              },
              width: {
                xs: "100%",
                sm: "unset"
              }
            }}
          >
            <Observer>
              {() => (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={mutation.isLoading}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: 170,
                      },
                      height: 55,
                      fontSize: 20,
                      color: "#fff",
                    }}
                  >
                    Send Reply
                  </Button>
                </>
              )}
            </Observer>
          </Box>
        </Box>
      </Box>
    </form >
  );
}