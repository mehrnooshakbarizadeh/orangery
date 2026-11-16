// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React from "react";

// external dependencies
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";

// orangery elements & internal dependencies
import {
  ValueState,
} from "../../../states/mobx-form";
import {
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryFormWrapper,
  OrangeryColorAutocomplete,
  OrangeryTabs,
} from "../../OrangeryElements";
import MeetingRoomsWidgetPreviewButton from "./MeetingRoomsWidgetPreviewButton";

// queries & backend
//

// icons, images & colors
//

export class EmbedMeetingRoomsFormState {
  public caption;
  public color;

  constructor() {
    this.caption = new ValueState("Meeting Rooms");
    this.color = new ValueState("#2B2E33");

    makeAutoObservable(this);
  }
}

export default function EmbedMeetingRoomsForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { currentOffice } = useGlobalState();

  const state = React.useMemo(
    () => new EmbedMeetingRoomsFormState(),
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    handleClose();
  }

  return (
    <OrangeryFormWrapper
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={`Embed Meeting Rooms`}
      // style={{
      //   width: 601,
      //   height: 395
      // }}
      footer={
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Observer>
            {() => (
              <MeetingRoomsWidgetPreviewButton
                officeName={currentOffice.name}
                officeUuid={currentOffice.uuid}
                color={state.color.value}
                caption={state.caption.value}
              />
            )}
          </Observer>

          <Button
            variant="contained"
            type="submit"
            color="primary"
            sx={{
              width: 170,
              height: 55,
              fontSize: 20,
              color: "#fff",
              // backgroundColor: "#2B2E33 !important"
            }}
          >
            OK
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          height: "551px",
          width: "100%",
          pl: 4,
          pr: 2,
        }}
      >
        <OrangeryTabs
          height="calc(100% - 24px)"
          sx={{
            width: "100%",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              // outline: "1px solid slategrey",
              borderRadius: 5,
            },
          }}
          tabs={[
            {
              label: "HTML/JS",
              content:
                <Observer>
                  {() => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          height: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          Widget Descriptions: You can use embed this widget in your website to share your public meeting rooms.
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ width: "60%" }}>
                            <Observer>
                              {() => (
                                <OrangeryTextField
                                  label="BUTTON CAPTION"
                                  name="caption"
                                  placeholder="Button Caption"
                                  value={state.caption.value}
                                  helperText={state.caption.error}
                                  onChange={(e: any) => {
                                    state.caption.value = e.target.value
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>

                          <Box sx={{ width: "40%" }}>
                            <Observer>
                              {() => (
                                <OrangeryColorAutocomplete
                                  label="COLOR"
                                  placeholder="Select Color"
                                  value={state.color.value}
                                  onChange={(newValue) => {
                                    if (newValue)
                                      state.color.value = newValue
                                    else
                                      state.color.value = "#2B2E33"
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place this <div> element wherever you want to show on your website. You should adjust width and height styling of this element with standard css values, e.g. "100%", "176px", etc.:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: 80,
                                  mb: 7,
                                }}
                                label="Related DIV"
                                multiline
                                value={
                                  `<div id="orangery-meeting-room-widget" data-office="${currentOffice.name}" data-token="${currentOffice.uuid}" data-color="${state.color.value}" data-caption="${state.caption.value}" class="orangery-meeting-room-widget" style="width: 100%; margin: auto;"></div>`
                                }
                              />)}
                          </Observer>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place this code as last child of <body> element:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: "20px !important",
                                  mb: 7,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    hegit: 61
                                  }
                                }}
                                editorHeight="50px"
                                label="Embed Script"
                                multiline
                                value={
                                  `<script src="${process.env.NEXT_PUBLIC_ORANGERY_LANDING_URL}/meeting-room-link-widget/${process.env.NEXT_PUBLIC_ENV_SLUG}/index.min.js"></script>`
                                }
                              />)}
                          </Observer>
                        </Box>
                      </Box>
                    </>
                  )}
                </Observer>
            },
            {
              label: "ReactJS",
              content:
                <Observer>
                  {() => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          height: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          Widget Descriptions: You can use embed this widget in your website to share your public meeting rooms.
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ width: "60%" }}>
                            <Observer>
                              {() => (
                                <OrangeryTextField
                                  label="BUTTON CAPTION"
                                  name="caption"
                                  placeholder="Button Caption"
                                  value={state.caption.value}
                                  helperText={state.caption.error}
                                  onChange={(e: any) => {
                                    state.caption.value = e.target.value
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>

                          <Box sx={{ width: "40%" }}>
                            <Observer>
                              {() => (
                                <OrangeryColorAutocomplete
                                  label="COLOR"
                                  placeholder="Select Color"
                                  value={state.color.value}
                                  onChange={(newValue) => {
                                    if (newValue)
                                      state.color.value = newValue
                                    else
                                      state.color.value = "#2B2E33"
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place this <div> element wherever you want to show on your website. You should adjust width and height styling of this element with standard css values, e.g. "100%", "176px", etc.:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: 80,
                                  mb: 7,
                                }}
                                label="Related DIV"
                                multiline
                                value={
                                  `<div id="orangery-meeting-room-widget" data-office="${currentOffice.name}" data-token="${currentOffice.uuid}" data-color="${state.color.value}" data-caption="${state.caption.value}" class="orangery-meeting-room-widget" style="width: 100%; margin: auto;"></div>`
                                }
                              />)}
                          </Observer>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place this code as last child of <body> element in index.html file in public folder:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: "20px !important",
                                  mb: 7,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    hegit: 61
                                  }
                                }}
                                editorHeight="50px"
                                label="Embed Script"
                                multiline
                                value={
                                  `<script src="${process.env.NEXT_PUBLIC_ORANGERY_LANDING_URL}/meeting-room-link-widget/${process.env.NEXT_PUBLIC_ENV_SLUG}/index.min.js"></script>`
                                }
                              />)}
                          </Observer>
                        </Box>
                      </Box>
                    </>
                  )}
                </Observer>
            },
            {
              label: "NextJS",
              content:
                <Observer>
                  {() => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          height: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          Widget Descriptions: You can use embed this widget in your website to share your public meeting rooms.
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ width: "60%" }}>
                            <Observer>
                              {() => (
                                <OrangeryTextField
                                  label="BUTTON CAPTION"
                                  name="caption"
                                  placeholder="Button Caption"
                                  value={state.caption.value}
                                  helperText={state.caption.error}
                                  onChange={(e: any) => {
                                    state.caption.value = e.target.value
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>

                          <Box sx={{ width: "40%" }}>
                            <Observer>
                              {() => (
                                <OrangeryColorAutocomplete
                                  label="COLOR"
                                  placeholder="Select Color"
                                  value={state.color.value}
                                  onChange={(newValue) => {
                                    if (newValue)
                                      state.color.value = newValue
                                    else
                                      state.color.value = "#2B2E33"
                                  }}
                                />
                              )}
                            </Observer>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place this <div> element wherever you want to show on your website. You should adjust width and height styling of this element with standard css values, e.g. "100%", "176px", etc.:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: 80,
                                  mb: 7,
                                }}
                                label="Related DIV"
                                multiline
                                value={
                                  `<div id="orangery-meeting-room-widget" data-office="${currentOffice.name}" data-token="${currentOffice.uuid}" data-color="${state.color.value}" data-caption="${state.caption.value}" class="orangery-meeting-room-widget" style="width: 100%; margin: auto;"></div>`
                                }
                              />)}
                          </Observer>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 400,
                            mb: 2
                          }}
                        >
                          {`Place a <Head /> at the and of your render function and place this code in it:`}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Observer>
                            {() => (
                              <OrangeryTextAreaField
                                sx={{
                                  height: "20px !important",
                                  mb: 7,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    hegit: 61
                                  }
                                }}
                                editorHeight="50px"
                                label="Embed Script"
                                multiline
                                value={
                                  `<script src="${process.env.NEXT_PUBLIC_ORANGERY_LANDING_URL}/meeting-room-link-widget/${process.env.NEXT_PUBLIC_ENV_SLUG}/index.min.js"></script>`
                                }
                              />)}
                          </Observer>
                        </Box>
                      </Box>
                    </>
                  )}
                </Observer>
            }
          ]
          }
        />
      </Box>
    </OrangeryFormWrapper>
  );
}
