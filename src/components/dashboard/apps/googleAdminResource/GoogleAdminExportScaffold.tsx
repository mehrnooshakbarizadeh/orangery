//React and Next
import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Observer } from "mobx-react-lite";
//Orangery elements & internal dependencies
import { OrangeryText } from "../../../OrangeryElements";
import { Flag } from "./formComponents/Flag";
// icons, images & colors
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";
import CheckIcon from "../../../../assets/svg/apps/googleAdminResources/check-green.svg";
import CrossIcon from "../../../../assets/svg/apps/googleAdminResources/cross-red.svg";
import WarningIcon from "../../../../assets/svg/apps/googleAdminResources/warning-red.svg";
//Queries & Backend

export default function GoogleAdminExportScaffold({
  mainTitle,
  leftList,
  rightList,
  formFooter,
  afterSyncExport,
  totalErrorsCount,
}: {
  mainTitle: any;
  leftList?: any;
  rightList?: any;
  formFooter?: any;
  afterSyncExport?: any;
  totalErrorsCount?: number;
}) {
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          height: "100%",
          // minHeight: 666,
          borderRadius: 1.5,
          py: 3,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GoogleAdminLogo />
          <Typography sx={{ ml: 2, fontSize: "26px", fontWeight: 600 }}>
            Google Admin Resources
          </Typography>
        </Box>

        <Box
          sx={{
            pr: 1,
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: 2.5,
            mt: 3,
            pt: 0.5,
            pb: 0.5,
            pl: 0.5,
            height: `calc(100% - 56px - 85px)`,
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          <>
            <Grid container spacing={2} sx={{ pr: 8 }}>
              <Grid
                item
                xs={12}
                lg={6}
                sx={{ position: "relative" }}
                alignItems={afterSyncExport ? "center" : "unset"}
                justifyContent={afterSyncExport ? "center" : "unset"}
              >
                {mainTitle}
                {leftList}
                {afterSyncExport === true ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      rowGap: 1,
                      mt: 20,
                      ml: 20,
                      mb: 20,
                    }}
                  >
                    {totalErrorsCount && totalErrorsCount > 0 ? (
                      <>
                        <WarningIcon style={{ height: 40, weight: 40 }} />
                        <Typography
                          sx={{ mx: "auto", fontSize: 20, fontWeight: 600 }}
                        >
                          {`Sync completed with ${totalErrorsCount.toString()} ${
                            totalErrorsCount > 1 ? `errors` : `error`
                          }.`}
                        </Typography>
                        <Typography
                          sx={{ font: 16, fontWeight: 600, color: "#55585C" }}
                        >
                          Make sure your account has full access to Google
                          Admin.
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckIcon style={{ height: 40, weight: 40 }} />
                        <Typography
                          sx={{ mx: "auto", fontSize: 20, fontWeight: 600 }}
                        >
                          All selected item imported successfully.
                        </Typography>
                      </>
                    )}
                  </Box>
                ) : (
                  <></>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  alignSelf: "start",
                  justifyContent: { xs: "center", md: "end" },
                  position: { xs: "static", md: "absolute" },
                  right: { xs: 0, md: 100 },
                }}
              >
                <Box>{rightList}</Box>
              </Grid>
            </Grid>
          </>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "#F9F9FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "85px",
          width: "100%",
          borderRadius: 1.5,
          py: 3,
          px: 2,
        }}
      >
        {formFooter}
      </Box>
    </Box>
  );
}

export function ResourceListCard({
  resource,
  offices,
  buildings,
}: {
  resource: any;
  offices?: any;
  buildings?: any;
}) {
  const children = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 1.3,
        pl: 1.7,
        borderLeft: "1px solid black",
      }}
    >
      {resource.value.meetingRooms.map((item: any, index: number) =>
        !item.synced ? (
          <FormControlLabel
            key={item.id}
            label={<OrangeryText text={item.name} limit={30} />}
            control={
              <Observer>
                {() => (
                  <Checkbox
                    checked={item.selected.value}
                    onChange={(e) => {
                      item.selected.value = e.target.checked;
                    }}
                  />
                )}
              </Observer>
            }
          />
        ) : (
          <></>
        )
      )}
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const [openFloor, setOpenFloor] = React.useState(false);

  return (
    <Observer>
      {() => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            py: 3.5,
            pl: 2.5,
            pr: 1,
            minWidth: "835px",
            // height: "310px",
            borderRadius: "10px",
            backgroundColor: `${
              resource.value.meetingRooms.filter(
                (item: any) => !item.synced && item.selected.value
              ).length
                ? `#e4f5e933`
                : `#FFF`
            }`,
            border: `1px solid ${
              resource.value.meetingRooms.filter(
                (item: any) => !item.synced && item.selected.value
              ).length
                ? `#42B863`
                : `#55585C`
            }`,
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          <Box>
            {" "}
            <FormControlLabel
              label={resource.value.office.name}
              control={
                <Observer>
                  {() => (
                    <Checkbox
                      checked={
                        resource.value.meetingRooms.filter(
                          (item: any) => !item.synced && !item.selected.value
                        ).length === 0
                      }
                      indeterminate={
                        resource.value.meetingRooms.filter(
                          (item: any) => !item.synced && !item.selected.value
                        ).length !== 0 &&
                        resource.value.meetingRooms.filter(
                          (item: any) => !item.synced && item.selected.value
                        ).length !== 0
                      }
                      onChange={(e) => {
                        resource.value.meetingRooms.map((item: any) => {
                          if (!item.synced) {
                            item.selected.value = e.target.checked;
                          }
                        });
                      }}
                    />
                  )}
                </Observer>
              }
            />
            {children}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              rowGap: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: "0 5px" }}>
              <Typography
                color="primary.light"
                sx={{ fontSize: 16, fontWeight: 400, mt: 2 }}
              >
                Assign to
              </Typography>
              <Box sx={{ width: resource.value.building_id.value ? 200 : 385 }}>
                <FormControl fullWidth>
                  <Observer>
                    {() => (
                      <Select
                        disabled={resource.value.emptyOfficeFloor.value}
                        inputProps={{
                          MenuProps: {
                            MenuListProps: {
                              sx: {
                                backgroundColor: "#F9F9FA",
                              },
                            },
                            PaperProps: {
                              style: {
                                width: resource.value.building_id.value
                                  ? 100
                                  : "auto",
                                borderTop: "none !important",
                                borderLeft: "1px solid #A5AAB4",
                                borderBottom: "1px solid #A5AAB4",
                                borderRight: "1px solid #A5AAB4",
                                boxShadow: "none",
                                borderRadius: "0 0 15px 15px",
                                overflowY: "scroll",
                                maxHeight: "400px",
                              },
                            },
                          },
                        }}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        MenuProps={{}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={resource.value.building_id.value}
                        onChange={(e) => {
                          resource.value.building_id.value = e.target.value;
                        }}
                        variant="standard"
                        renderValue={(selected) => {
                          return selected ? selected : "Select";
                        }}
                        placeholder="Select"
                        displayEmpty
                        sx={{
                          "&::before": { borderBottom: "0px" },
                          "&::after": { borderBottom: "0px" },
                          "&:hover:before": { borderBottom: "none !important" },
                          "& .MuiSelect-select": {
                            backgroundColor: "#F9F9FA !important",
                            height: "32px !important",
                            pt: 1.4,
                            px: 2,
                            borderTop: "1px solid #A5AAB4",
                            borderLeft: "1px solid #A5AAB4",
                            borderRight: "1px solid #A5AAB4",
                            borderBottom: open
                              ? "none !important"
                              : "1px solid #A5AAB4",
                            borderRadius: open ? "15px 15px 0 0" : "50px",
                            borderColor: resource.value.building_id.value
                              ? "#42B863"
                              : "#A5AAB4",
                          },
                          "& .MuiSelect-select:focus": {
                            borderRadius: open ? "15px 15px 0 0" : "50px",
                          },
                        }}
                      >
                        {buildings && buildings.length > 0 ? (
                          buildings.map((building: any) => (
                            <MenuItem
                              key={building.building.id}
                              value={building.building.name}
                            >
                              <OrangeryText
                                text={building.building.name}
                                limit={
                                  resource.value.building_id.value ? 20 : 40
                                }
                              />
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem>Empty</MenuItem>
                        )}
                      </Select>
                    )}
                  </Observer>
                </FormControl>
              </Box>
              {resource.value.building_id.value && (
                <Box sx={{ width: 200 }}>
                  <FormControl fullWidth>
                    <Observer>
                      {() => (
                        <Select
                          disabled={resource.value.emptyOfficeFloor.value}
                          displayEmpty
                          inputProps={{
                            MenuProps: {
                              MenuListProps: {
                                sx: {
                                  backgroundColor: "#F9F9FA",
                                },
                              },
                              PaperProps: {
                                style: {
                                  // maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
                                  // width: width ?? 225,
                                  width: 100,
                                  borderTop: "none !important",
                                  borderLeft: "1px solid #A5AAB4",
                                  borderBottom: "1px solid #A5AAB4",
                                  borderRight: "1px solid #A5AAB4",
                                  boxShadow: "none",
                                  borderRadius: "0 0 15px 15px",
                                  overflowY: "scroll",
                                  maxHeight: "400px",
                                },
                              },
                            },
                          }}
                          onOpen={() => setOpenFloor(true)}
                          onClose={() => setOpenFloor(false)}
                          MenuProps={{}}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={resource.value.floor_name.value}
                          onChange={(e) => {
                            resource.value.floor_name.value = e.target.value;
                          }}
                          variant="standard"
                          renderValue={(selected) => {
                            return selected ? selected : "Select";
                          }}
                          placeholder="Select"
                          sx={{
                            "&::before": { borderBottom: "0px" },
                            "&::after": { borderBottom: "0px" },
                            "&:hover:before": {
                              borderBottom: "none !important",
                            },
                            "& .MuiSelect-select": {
                              backgroundColor: "#F9F9FA !important",
                              height: "32px !important",
                              pt: 1.4,
                              px: 2,
                              borderTop: "1px solid #A5AAB4",
                              borderLeft: "1px solid #A5AAB4",
                              borderRight: "1px solid #A5AAB4",
                              borderBottom: openFloor
                                ? "none !important"
                                : "1px solid #A5AAB4",
                              borderRadius: openFloor
                                ? "15px 15px 0 0"
                                : "50px",
                              borderColor: resource.value.floor_name.value
                                ? "#42B863"
                                : "#A5AAB4",
                            },
                            "& .MuiSelect-select:focus": {
                              borderRadius: openFloor
                                ? "15px 15px 0 0"
                                : "50px",
                            },
                          }}
                        >
                          {resource.value.building_id.value &&
                            buildings
                              .find(
                                (building: any) =>
                                  building.building.name ===
                                  resource.value.building_id.value
                              )
                              ?.building.floor_names.map(
                                (floor: any, idx: number) => (
                                  <MenuItem key={idx} value={floor}>
                                    <OrangeryText text={floor} limit={20} />
                                  </MenuItem>
                                )
                              )}
                        </Select>
                      )}
                    </Observer>
                  </FormControl>
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
              <Divider sx={{ width: 170 }} />
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "#A5AAB4" }}
              >
                OR
              </Typography>
              <Divider sx={{ width: 170 }} />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      resource.value.emptyOfficeFloor.value = e.target.checked;
                      if (e.target.checked) {
                        resource.value.building_id.value = "";
                        resource.value.floor_name.value = "";
                      }
                    }}
                  />
                }
                label="Create respective resource(s) in Google Admin"
                sx={{ fontSize: 14, fontWeight: 600, color: "#55585C" }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Observer>
  );
}

export function PreviewMeetingRoomsForm({
  title,
  subTitle,
  listCard,
  emptyState,
}: {
  title: string;
  subTitle: any;
  listCard?: any;
  emptyState?: any;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", md: 460 },
        // height: "80%",
        minHeight: "40vh",
        maxHeight: "60vh",
        borderRadius: "15px",
        backgroundColor: "#F9F9FA",
        border: "3px dashed #55585C",
        pt: 2,
        mt: { xs: 5, md: 0 },
      }}
    >
      <Box
        sx={{ borderBottomStyle: "dashed", borderBottom: "3px dashed #55585C" }}
      >
        <Typography
          color="primary.light"
          sx={{ fontSize: 17, fontWeight: 700, px: 2, pb: 2 }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: 2, pt: 2 }}>{subTitle}</Box>
      <Observer>
        {() => (
          <Box
            sx={{
              pr: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignContent: "flex-start",
              px: 2,
              height: `calc(100% - 5px)`,
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                marginLeft: "20px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                borderRadius: 5,
              },
            }}
          >
            {listCard}
            {emptyState?.filter(
              (item: any) =>
                (item.value.building_id.value !== "" &&
                  item.value.floor_name.value !== "" &&
                  item.value.meetingRooms.filter(
                    (item: any) => item.synced === false && item.selected.value
                  ).length > 0) ||
                item.value.emptyOfficeFloor.value ||
                (item.value.building_id.value && item.value.floor_name.value)
            ).length === 0 && (
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#A5AAB4",
                  alignSelf: "center",
                  mt: 5,
                }}
              >
                Select items on the left to preview them here
              </Typography>
            )}
          </Box>
        )}
      </Observer>
    </Box>
  );
}

export function PreviewMeetingRoomsListCard({
  card,
  offices,
  googleResources,
}: {
  card?: any;
  offices?: any;
  googleResources?: any;
}) {
  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ display: "flex", rowGap: 1, flexDirection: "column" }}>
            {card.value.building_id.value &&
              card.value.floor_name.value &&
              card.value.meetingRooms.filter(
                (item: any) => item.synced === false && item.selected.value
              ).length > 0 && (
                <>
                  <Box sx={{ fontSize: 18, fontWeight: 700, color: "#2B2E33" }}>
                    {card.value.building_id.value}
                  </Box>
                  {card.value.meetingRooms.map(
                    (item: any, index: number) =>
                      !item.synced &&
                      item.selected.value && (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#55585C",
                            }}
                          >
                            {<OrangeryText text={item.name} limit={30} />}
                          </Typography>
                          <Box>
                            <Flag willAdd />
                          </Box>
                        </Box>
                      )
                  )}
                  {(googleResources.find(
                    (googleResource: any) =>
                      googleResource.building.name ===
                      card.value.building_id.value
                  ) &&
                    googleResources
                      .find(
                        (googleResource: any) =>
                          googleResource.building.name ===
                          card.value.building_id.value
                      )
                      .resources?.map((resource: any) => (
                        <Box
                          key={resource.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#55585C",
                            }}
                          >
                            {<OrangeryText text={resource.name} limit={30} />}
                          </Typography>
                          <Box>
                            <Flag />
                          </Box>
                        </Box>
                      ))) || <></>}
                  <Divider sx={{ my: 1.5 }} />
                </>
              )}
            {card.value.emptyOfficeFloor.value === true &&
              card.value.meetingRooms.filter(
                (item: any) => item.synced === false && item.selected.value
              ).length > 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ fontSize: 18, fontWeight: 700, color: "#2B2E33" }}
                    >
                      {card.value.office.name}
                    </Box>
                    <Box>
                      <Flag willAdd />
                    </Box>
                  </Box>
                  {card.value.meetingRooms.map(
                    (item: any, index: number) =>
                      !item.synced &&
                      item.selected.value && (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#55585C",
                            }}
                          >
                            {<OrangeryText text={item.name} limit={30} />}
                          </Typography>
                          <Box>
                            <Flag willAdd />
                          </Box>
                        </Box>
                      )
                  )}
                  <Divider sx={{ my: 1.5 }} />
                </>
              )}
          </Box>
        </>
      )}
    </Observer>
  );
}

export function PostSyncListCard({ responseCard }: { responseCard?: any }) {
  const errorCount = responseCard.resources.filter(
    (item: any) => item.error
  ).length;
  return (
    <Observer>
      {() => (
        <>
          <Box sx={{ display: "flex", rowGap: 1, flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ fontSize: 18, fontWeight: 700, color: "#2B2E33" }}>
                <OrangeryText text={responseCard.building} limit={30} />
              </Box>
              {errorCount ? (
                <Box
                  sx={{ fontSize: 12, fontWeight: 600, color: "#A5AAB4" }}
                >{`Done with ${errorCount} ${
                  errorCount > 1 ? `errors` : `error`
                }.`}</Box>
              ) : (
                <></>
              )}
            </Box>
            {responseCard.resources?.map((item: any, idx: any) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#55585C",
                  }}
                >
                  <OrangeryText text={item.name} limit={30} />
                </Typography>
                <Box>
                  {item.error ? (
                    <CrossIcon style={{ height: 12, width: 12 }} />
                  ) : (
                    <CheckIcon style={{ height: 12, width: 12 }} />
                  )}
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
          </Box>
        </>
      )}
    </Observer>
  );
}
