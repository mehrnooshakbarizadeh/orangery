//React and Next
import React, { useEffect } from "react";
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
//Orangery elements & internal dependencies
import { OrangeryText } from "../../../OrangeryElements";
import { Observer } from "mobx-react-lite";
// icons, images & colors
import GoogleAdminLogo from "../../../../assets/svg/apps/googleAdminResources/googleAdminLogo.svg";
import CheckIcon from "../../../../assets/svg/apps/googleAdminResources/check-green.svg";
import CrossIcon from "../../../../assets/svg/apps/googleAdminResources/cross-red.svg";
import WarningIcon from "../../../../assets/svg/apps/googleAdminResources/warning-orange.svg";
//Queries & Backend

export default function GoogleAdminImportScaffold({
  mainTitle,
  leftList,
  rightList,
  formFooter,
  afterSyncImport = false,
  afterSyncErrorCount,
  users,
}: {
  mainTitle: any;
  leftList?: any;
  rightList?: any;
  formFooter?: any;
  afterSyncImport?: any;
  afterSyncErrorCount?: any;
  users?: any;
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
          // px: 2,
        }}
      >
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GoogleAdminLogo />
          <Typography sx={{ ml: 2, fontSize: "26px", fontWeight: 600 }}>
            Google Admin Resources
          </Typography>
        </Box> */}

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
                alignItems={afterSyncImport ? "center" : "unset"}
                justifyContent={afterSyncImport ? "center" : "unset"}
                item
                xs={12}
                md={6}
                sx={{ position: "relative" }}
              >
                {mainTitle}
                {!afterSyncImport && (
                  <Box
                    sx={{
                      backgroundColor: "#EDEEF0",
                      borderRadius: "5px",
                      border: "1px solid #A5AAB4",
                      px: 1,
                      py: 1.3,
                      width: 175,
                      mb: 1.5,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControlLabel
                      label={"Select All"}
                      control={
                        <Observer>
                          {() => (
                            <>
                              <Checkbox
                                checked={
                                  users?.filter(
                                    (user: any) => user.selected.value
                                  ).length === users?.length
                                }
                                onChange={(e) => {
                                  users.map((user: any) => {
                                    user.selected.value = e.target.checked;
                                  });
                                }}
                              />
                            </>
                          )}
                        </Observer>
                      }
                    />
                  </Box>
                )}
                {leftList}
                {afterSyncImport ? (
                  afterSyncErrorCount === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 20,
                        ml: 20,
                        rowGap: 1,
                      }}
                    >
                      <CheckIcon style={{ height: 40, weight: 40 }} />
                      <Typography
                        sx={{ mx: "auto", fontSize: 20, fontWeight: 600 }}
                      >
                        All selected users imported successfully.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 30,
                        ml: 20,
                        rowGap: 1,
                      }}
                    >
                      <WarningIcon style={{ height: 40, weight: 40 }} />
                      <Typography
                        sx={{ mx: "auto", fontSize: 24, fontWeight: 700 }}
                      >
                        {`Sync completed with `}
                        <Box
                          component="span"
                          color={"#FF3D00"}
                        >{`${afterSyncErrorCount} ${
                          afterSyncErrorCount > 1 ? `errors` : `error`
                        }`}</Box>
                        .
                      </Typography>
                    </Box>
                  )
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

export function UserListCard({
  user,
  offices,
  groups,
  role,
}: {
  user: any;
  offices?: any;
  groups?: any;
  role?: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [openRole, setOpenRole] = React.useState(false);
  // useEffect(() => {
  //   user.office_id.value = offices[0].id;
  // }, []);
  return (
    <Observer>
      {() => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 3.5,
            pl: 1,
            pr: 1,
            mb: 0.5,
            height: 65,
            minWidth: "835px",
            // height: "310px",
            borderRadius: "10px",
            backgroundColor: `${user.selected.value ? `#e4f5e933` : `unset`}`,
            border: user.selected.value ? `1px solid #42B863` : `unset`,
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
            <FormControlLabel
              label={
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 400, color: "#A5AAB4" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              }
              control={
                <Observer>
                  {() => (
                    <>
                      <Checkbox
                        checked={user.selected.value}
                        onChange={(e) => {
                          user.selected.value = e.target.checked;
                        }}
                      />
                    </>
                  )}
                </Observer>
              }
            />
          </Box>
          <Box sx={{ display: "flex", columnGap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
              <Typography
                color="primary.light"
                sx={{ fontSize: 14, fontWeight: 400 }}
              >
                Office
              </Typography>
              <Box sx={{ width: 220 }}>
                <FormControl fullWidth>
                  <Observer>
                    {() => (
                      <Select
                        disabled={!user.selected.value}
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
                        value={user.office_id.value}
                        onChange={(e) => {
                          user.office_id.value = e.target.value;
                        }}
                        variant="standard"
                        renderValue={(selected) => {
                          return offices.find(
                            (item: any) => item.uuid === selected
                          )?.name;
                        }}
                        displayEmpty
                        placeholder="Select"
                        sx={{
                          "&::before": { borderBottom: "0px" },
                          "&::after": { borderBottom: "0px" },
                          "&:hover:before": { borderBottom: "none !important" },
                          "& .MuiSelect-select": {
                            fontSize: 14,
                            fontWeight: 600,
                            backgroundColor: "#F9F9FA !important",
                            height: "35px !important",
                            pb: 0,
                            pt: -1,
                            px: 2,
                            borderTop: "1px solid #A5AAB4",
                            borderLeft: "1px solid #A5AAB4",
                            borderRight: "1px solid #A5AAB4",
                            borderBottom: open
                              ? "none !important"
                              : "1px solid #A5AAB4",
                            borderRadius: open ? "15px 15px 0 0" : "50px",
                            borderColor: "#A5AAB4",
                          },
                          "& .MuiSelect-select:focus": {
                            borderRadius: open ? "15px 15px 0 0" : "50px",
                          },
                        }}
                      >
                        {offices &&
                          offices.length > 0 &&
                          offices.map((office: any) => (
                            <MenuItem
                              key={office.uuid}
                              value={office.uuid}
                              sx={{ fontSize: 14, fontWeight: 600 }}
                            >
                              <OrangeryText text={office.name} limit={30} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </Observer>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
              <Typography
                color="primary.light"
                sx={{ fontSize: 14, fontWeight: 400 }}
              >
                Role
              </Typography>
              <Box sx={{ width: 220 }}>
                <FormControl fullWidth>
                  <Observer>
                    {() => (
                      <Select
                        disabled={!user.selected.value}
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
                        onOpen={() => setOpenRole(true)}
                        onClose={() => setOpenRole(false)}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={user.group_uuid.value}
                        onChange={(e) => {
                          user.group_uuid.value = e.target.value;
                        }}
                        variant="standard"
                        renderValue={(selected) => {
                          return groups?.find(
                            (group: any) => group.uuid === selected
                          )?.display_name;
                        }}
                        placeholder="Select"
                        displayEmpty
                        sx={{
                          "&::before": { borderBottom: "0px" },
                          "&::after": { borderBottom: "0px" },
                          "&:hover:before": { borderBottom: "none !important" },
                          "& .MuiSelect-select": {
                            fontSize: 14,
                            fontWeight: 600,
                            backgroundColor: "#F9F9FA !important",
                            height: "35px !important",
                            pb: 0,
                            pt: -1,
                            px: 2,
                            borderTop: "1px solid #A5AAB4",
                            borderLeft: "1px solid #A5AAB4",
                            borderRight: "1px solid #A5AAB4",
                            borderBottom: openRole
                              ? "none !important"
                              : "1px solid #A5AAB4",
                            borderRadius: openRole ? "15px 15px 0 0" : "50px",
                            borderColor: "#A5AAB4",
                          },
                          "& .MuiSelect-select:focus": {
                            borderRadius: openRole ? "15px 15px 0 0" : "50px",
                          },
                        }}
                      >
                        {groups &&
                          groups.length > 0 &&
                          groups.map((group: any) => (
                            <MenuItem
                              key={group.uuid}
                              value={group.uuid}
                              sx={{ fontSize: 14, fontWeight: 600 }}
                            >
                              <OrangeryText
                                text={group.display_name}
                                limit={20}
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </Observer>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Observer>
  );
}

export function PreviewOSUsersForm({
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
        <Observer>{() => listCard}</Observer>
        <Observer>
          {() =>
            emptyState ? (
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
            ) : (
              <></>
            )
          }
        </Observer>
      </Box>
    </Box>
  );
}

export function PreviewOSUsersListCard({
  offices,
  user,
  groups,
  afterSync,
}: {
  offices?: any;
  groups?: any;
  user?: any;
  afterSync?: any;
}) {
  return (
    <Observer>
      {() => (
        <>
          {user.selected.value && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    columnGap: 1,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#55585C",
                  }}
                >
                  {<OrangeryText text={user.firstName} limit={15} />}{" "}
                  {<OrangeryText text={user.lastName} limit={15} />}
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      display: "flex",
                      columnGap: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      alignItems: "center",
                    }}
                  >
                    {
                      groups.find(
                        (group: any) => group.uuid === user.group_uuid.value
                      ).display_name
                    }{" "}
                    <Typography
                      sx={{ color: "#A5AAB4", fontSize: 14, fontWeight: 600 }}
                    >
                      at
                    </Typography>
                    {
                      <OrangeryText
                        text={
                          offices.find(
                            (office: any) =>
                              office.uuid === user.office_id.value
                          ).name
                        }
                        limit={15}
                      />
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Observer>
  );
}

export function PostSyncListCard({
  afterSyncUser,
  groups,
}: {
  afterSyncUser: any;
  groups: any;
}) {
  return (
    <Observer>
      {() => (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: "#55585C",
              }}
            >
              <OrangeryText text={afterSyncUser.name} limit={20} />
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",

                  height: "50px",
                  justifyContent: afterSyncUser.error ? "flex-end" : "center",
                  alignSelf: "flex-end",
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {/* {afterSyncUser.role} */}
                  {
                    groups.find(
                      (group: any) => group.name === afterSyncUser.role
                    ).display_name
                  }
                  <Box component="span" color={"#A5AAB4"}>
                    {" at "}
                  </Box>
                  {afterSyncUser.office}
                </Typography>
                {afterSyncUser.error && (
                  <Typography
                    sx={{ fontSize: 10, fontWeight: 600, color: "#FF3D00" }}
                  >
                    {afterSyncUser.error.message}
                  </Typography>
                )}
              </Box>
              <Box>
                {afterSyncUser.error ? (
                  <CrossIcon style={{ height: 12, width: 12 }} />
                ) : (
                  <CheckIcon style={{ height: 12, width: 12 }} />
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Observer>
  );
}
