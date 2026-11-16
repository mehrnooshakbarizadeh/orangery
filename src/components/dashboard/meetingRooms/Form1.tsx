import { Box, InputAdornment } from "@mui/material";
import { Observer } from "mobx-react-lite";
import NumberFormat from "react-number-format";
import { IMeetingRoom } from "../../../queries/meetingRoom";
import {
  OrangeryDepartmentAutocomplete,
  OrangeryFloorAutocomplete,
  OrangeryTextAreaField,
  OrangeryTextField,
} from "../../OrangeryElements";
import AssetField from "./add_asset/AssetField";
import { AssetState, MeetingRoomState } from "./HandleRoomForm";
import CapacityIcon from "../../../assets/svg/capacity.svg";
import MeetingRoomIcon from "../../../assets/svg/dashboard/newMenuSVGs/meetingRoom.svg";
import EuroIcon from "../../../assets/svg/euro.svg";
import ClockIcon from "../../../assets/svg/clockNine.svg";
import { UploadImageComponent } from "../../OrangeryElements/OrangeryUploadImage";

export default function Form1({
  state,
  meetingRoom,
  asset,
}: {
  asset?: AssetState;
  state: MeetingRoomState;
  meetingRoom?: IMeetingRoom;
}) {
  return (
    <>
      <form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            height: "667px",
            width: "100%",
          }}
        >
          <Observer>
            {() => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    height: "100%",
                    pt: 4,
                    px: 4,
                    rowGap: 2,
                    width: "904px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: "33%" }}>
                      <Observer>
                        {() => (
                          <OrangeryTextField
                            label="NAME"
                            name="name"
                            startIcon={<MeetingRoomIcon />}
                            placeholder="Meeting Room Name"
                            error={!!state.name.error}
                            value={state.name.value}
                            helperText={state.name.error}
                            onChange={(e: any) =>
                              (state.name.value = e.target.value)
                            }
                          />
                        )}
                      </Observer>
                    </Box>

                    <Box sx={{ width: "33%" }}>
                      <Observer>
                        {() => (
                          <OrangeryFloorAutocomplete
                            label="FLOOR"
                            placeholder="Select/Create Floor"
                            value={state.floor_uuid.value}
                            onChange={(newValue) => {
                              state.floor_uuid.value = newValue;
                            }}
                          />
                        )}
                      </Observer>
                    </Box>

                    <Box sx={{ width: "33%" }}>
                      <Observer>
                        {() => (
                          <OrangeryDepartmentAutocomplete
                            label="DEPARTMENT"
                            placeholder="Select/Create Department"
                            value={state.department_uuid.value}
                            onChange={(newValue) => {
                              state.department_uuid.value = newValue;
                            }}
                          />
                        )}
                      </Observer>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      rowGap: 5,
                    }}
                  >
                    <Box sx={{ width: "22%", flex: 1 }}>
                      <Observer>
                        {() => (
                          <NumberFormat
                            fullWidth
                            customInput={OrangeryTextField}
                            label="CAPACITY"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{
                                    "& .stock-icon": {
                                      width: "1.3rem",
                                      color: "#A5AAB4",
                                    },
                                  }}
                                >
                                  <CapacityIcon className="stock-icon" />
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            allowNegative={false}
                            value={state.capacity.value?.toString()}
                            error={!!state.capacity.error}
                            helperText={state.capacity.error}
                            onChange={(e: any) =>
                              (state.capacity.value = parseInt(e.target.value))
                            }
                          />
                        )}
                      </Observer>
                    </Box>
                    <Box sx={{ width: "22%", flex: 1 }}>
                      <Observer>
                        {() => (
                          <NumberFormat
                            thousandsGroupStyle="wan"
                            fixedDecimalScale={true}
                            value={state.price.value?.toString()}
                            // prefix="$"
                            decimalSeparator="."
                            customInput={OrangeryTextField}
                            fullWidth
                            label="PRICE (PER HOUR)"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{
                                    "& .euro-icon": {
                                      width: "1.2rem",
                                      height: "1.2rem",
                                      color: "#A5AAB4",
                                    },
                                  }}
                                >
                                  <EuroIcon className="euro-icon" />
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            thousandSeparator={false}
                            allowNegative={false}
                            decimalScale={2}
                            error={!!state.price.error}
                            // helperText={state.price.error}
                            onChange={(e: any) =>
                              (state.price.value = parseFloat(e.target.value))
                            }
                            disabled={!!meetingRoom?.tenant_office_uuid}
                          />
                        )}
                      </Observer>
                    </Box>
                    <Box sx={{ width: "22%", flex: 1 }}>
                      <Observer>
                        {() => (
                          <NumberFormat
                            thousandsGroupStyle="wan"
                            fixedDecimalScale={true}
                            value={state.daily_price.value?.toString()}
                            decimalSeparator="."
                            customInput={OrangeryTextField}
                            fullWidth
                            label="DAILY PRICE"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{
                                    "& .euro-icon": {
                                      width: "1.2rem",
                                      height: "1.2rem",
                                      color: "#A5AAB4",
                                    },
                                  }}
                                >
                                  <EuroIcon className="euro-icon" />
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            thousandSeparator={false}
                            allowNegative={false}
                            decimalScale={2}
                            error={!!state.daily_price.error}
                            onChange={(e: any) => {
                              state.daily_price.value = parseFloat(
                                e.target.value
                              );
                              if (!state.number_of_hours_to_daily_price.value)
                                state.number_of_hours_to_daily_price.value = 4; ////////!!!!!!!! 4 as default based on related jira ticket description
                            }}
                            disabled={!!meetingRoom?.tenant_office_uuid}
                          />
                        )}
                      </Observer>
                    </Box>
                    <Box sx={{ width: "22%", flex: 1 }}>
                      <Observer>
                        {() => (
                          <NumberFormat
                            fullWidth
                            customInput={OrangeryTextField}
                            label="HOURS TO DAILY"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  sx={{
                                    "& .icon": {
                                      width: "1.2rem",
                                      height: "1.2rem",
                                      color: "#A5AAB4",
                                    },
                                  }}
                                >
                                  <ClockIcon className="icon" />
                                </InputAdornment>
                              ),
                            }}
                            type="text"
                            allowNegative={false}
                            value={state.number_of_hours_to_daily_price.value?.toString()}
                            error={!!state.number_of_hours_to_daily_price.error}
                            helperText={
                              state.number_of_hours_to_daily_price.error
                            }
                            onChange={(e: any) =>
                              (state.number_of_hours_to_daily_price.value =
                                parseFloat(e.target.value))
                            }
                            disabled={!!meetingRoom?.tenant_office_uuid}
                          />
                        )}
                      </Observer>
                    </Box>
                  </Box>
                  <Observer>
                    {() => (
                      <OrangeryTextAreaField
                        sx={{
                          // height: "80px",
                          mb: 3,
                          width: "100%",
                        }}
                        editorHeight="120px"
                        label="DESCRIPTION"
                        name="description"
                        multiline
                        placeholder="Enter Description"
                        error={!!state.description.error}
                        value={state.description.value}
                        helperText={state.description.error}
                        onChange={(e: any) =>
                          (state.description.value = e.target.value)
                        }
                      />
                    )}
                  </Observer>
                  <Observer>
                    {() => (
                      <UploadImageComponent
                        limit={5}
                        images={state.image_uuids.values?.map((v) => v.value)}
                        handleChange={(newValues) => {
                          newValues.forEach((e) => {
                            const i = state.image_uuids.values.findIndex(
                              (v) => v.value === e
                            );
                            if (i === -1) {
                              state.image_uuids.pushElementValue(e);
                            }
                          });
                          state.image_uuids.values.forEach((v, j) => {
                            const i = newValues.findIndex((e) => v.value === e);
                            if (i === -1) {
                              state.image_uuids.deleteElementValue(j);
                            }
                          });
                        }}
                      />
                    )}
                  </Observer>

                  <Observer>
                    {() => (
                      <AssetField
                        state={state}
                        asset={asset}
                        meetingRoom={meetingRoom}
                      />
                    )}
                  </Observer>
                </Box>
              </>
            )}
          </Observer>
        </Box>
      </form>
    </>
  );
}
