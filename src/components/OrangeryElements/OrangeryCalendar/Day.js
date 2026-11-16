// contexts & globals
//

// react & next
import React from "react";

//
import PropTypes from "prop-types";
import { Typography, Grid, Box, Fab } from "@mui/material";
import moment from "moment";

//
import {
  OrangeryDrawer,
  OrangeryTabs,
  OrangerySeeAllEmployeesButton,
  OrangeryTag,
  OrangeryUserCircle,
  OrangeryUserCard2,
  OrangeryUserCard4,
} from "../../OrangeryElements";

const Day = ({ schedule, label, disabled, style, isToday, day }) => {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  let scheduleOfThisDay = {
    bookings: [
      ...(schedule?.filter(
        (schedule) =>
          schedule.parking_spot &&
          moment(schedule.date).format("YYYY-MM-DD") ===
            moment(day).format("YYYY-MM-DD")
      ) ?? []),
      ...(schedule?.filter(
        (schedule) =>
          schedule.meeting_room &&
          moment(schedule.date).format("YYYY-MM-DD") ===
            moment(day).format("YYYY-MM-DD")
      ) ?? []),
      ...(schedule?.filter(
        (schedule) =>
          schedule.desk &&
          moment(schedule.date).format("YYYY-MM-DD") ===
            moment(day).format("YYYY-MM-DD")
      ) ?? []),
    ],

    products:
      schedule?.filter(
        (schedule) =>
          schedule.product &&
          (schedule.product.type === "day-pass" ||
            schedule.product.type === "mobility") && ////////!!!!!!!!
          moment(schedule.date).format("YYYY-MM-DD") ===
            moment(day).format("YYYY-MM-DD")
      ) ?? [],

    visitors:
      schedule?.filter(
        (schedule) =>
          schedule.visitor &&
          moment(schedule.date).format("YYYY-MM-DD") ===
            moment(day).format("YYYY-MM-DD")
      ) ?? [],
  };

  let summaryScheduleOfThisDay = {
    bookings_count: scheduleOfThisDay.bookings?.length ?? 0,
    products_count: scheduleOfThisDay.products?.length ?? 0,
    visitors_count: scheduleOfThisDay.visitors?.length ?? 0,
  };

  let hasData =
    summaryScheduleOfThisDay.bookings_count +
      summaryScheduleOfThisDay.products_count +
      summaryScheduleOfThisDay.visitors_count >
    0;

  const handleClick = () => {
    if (!disabled && hasData) {
      setOpen(true);
      setChecked(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setChecked(false);
  };

  return (
    <>
      <Grid
        item
        xs={1}
        sx={{
          p: 0.5,
          ...(disabled
            ? {
                display: {
                  xs: "none",
                  md: "unset",
                },
              }
            : { display: "unset" }),
        }}
      >
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            flexDirection: "column",
            cursor: !disabled ? (hasData ? "pointer" : "unset") : "unset",
            width: "100%",
            height: "100%",
            borderRadius: 2,
            color: "#7188AD",
            backgroundColor: "#EBF0F8",
            ...(!checked && !disabled ? { backgroundColor: "#EBF0F8" } : {}),
            ...(disabled ? { backgroundColor: "#F7F9FC" } : {}),
            ...(isToday ? { border: "4px solid #7188AD" } : {}),
            ...(checked && !disabled
              ? { backgroundColor: "#7188AD", color: "white" }
              : {}),
            ...(checked && disabled ? { backgroundColor: "#F7F9FC" } : {}),
            ...style,
            gap: 0.1,
            px: 1,
            pb: {
              xs: 1,
              md: "unset",
            },
          }}
        >
          <Typography
            color="inherit"
            style={{
              width: "100%",
              textAlign: "right",
              fontSize: 26,
              fontWeight: 700,
              ...(checked ? { color: "white" } : {}),
            }}
          >
            {label}
          </Typography>
          {!disabled && (
            <>
              {summaryScheduleOfThisDay?.bookings_count ? (
                <SummaryRow
                  title={"Bookings"}
                  count={summaryScheduleOfThisDay.bookings_count}
                />
              ) : (
                <></>
              )}
              {summaryScheduleOfThisDay?.products_count ? (
                <SummaryRow
                  title={"Offers"}
                  count={summaryScheduleOfThisDay.products_count}
                />
              ) : (
                <></>
              )}
              {summaryScheduleOfThisDay?.visitors_count ? (
                <SummaryRow
                  title={"Visitors"}
                  count={summaryScheduleOfThisDay.visitors_count}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </Grid>

      {open && (
        <ShowSchedule
          scheduleOfThisDay={scheduleOfThisDay}
          day={day}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

Day.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  checked: PropTypes.bool, //.isRequired,
  onCheck: PropTypes.func, //.isRequired,
  className: PropTypes.string,
};

export default Day;

const SummaryRow = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          fontSize: 10,
          fontWeight: 600,
          borderRadius: 100,
          backgroundColor: "#2B2E33",
          color: "white",
          flex: "none",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {props.count}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {props.title}
      </Typography>
    </Box>
  );
};

function ShowSchedule({ scheduleOfThisDay, day, handleClose }) {
  return (
    <OrangeryDrawer
      open={open}
      handleClose={handleClose}
      // direction={"left"}
      // position={ }
    >
      <Typography
        sx={{
          fontSize: 29,
          fontWeight: 700,
          mb: 3,
        }}
      >
        {day && moment(day).format("dddd - DD.MM.YY")}
      </Typography>

      <OrangeryTabs
        height="calc(100% - 110px)"
        sx={{
          width: {
            xs: "100%",
            sm: 550,
          },
          maxWidth: {
            xs: "100%",
            sm: 550,
          },
          mt: 2,
          py: 0,
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
          ...(scheduleOfThisDay.bookings &&
          scheduleOfThisDay.bookings.length > 0
            ? [
                {
                  label: "Bookings",
                  content: (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {scheduleOfThisDay.bookings &&
                      scheduleOfThisDay.bookings.length > 0
                        ? scheduleOfThisDay.bookings?.map((booking) => (
                            <ScheduleItemCard
                              key={`booking-${booking?.uuid}`}
                              item={booking}
                            />
                          ))
                        : "No booking is available."}
                    </Box>
                  ),
                },
              ]
            : []),
          ...(scheduleOfThisDay.products &&
          scheduleOfThisDay.products.length > 0
            ? [
                {
                  label: "Offers",
                  content: (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {scheduleOfThisDay.products &&
                      scheduleOfThisDay.products.length > 0
                        ? scheduleOfThisDay.products?.map((product) => (
                            <ScheduleItemCard
                              key={`product-${product.uuid}`}
                              item={product}
                            />
                          ))
                        : "No offer is available."}
                    </Box>
                  ),
                },
              ]
            : []),
          ...(scheduleOfThisDay.visitors &&
          scheduleOfThisDay.visitors.length > 0
            ? [
                {
                  label: "Visitors",
                  content: (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {scheduleOfThisDay.visitors &&
                      scheduleOfThisDay.visitors.length > 0
                        ? scheduleOfThisDay.visitors?.map((visitor) => (
                            <ScheduleItemCard
                              key={`visitor-${visitor?.visitor?.uuid}`}
                              item={visitor}
                            />
                          ))
                        : "No visitor is available."}
                    </Box>
                  ),
                },
              ]
            : []),
        ]}
      />
    </OrangeryDrawer>
  );
}

function ScheduleItemCard({ item }) {
  return (
    <Box
      sx={{
        border: "1px solid #D2D3D6",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {item.meeting_room && (
        <>
          <Box
            sx={{
              borderBottom: "1px solid #D2D3D6",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 600,
                wordBreak: "break-all",
                maxWidth: "65%",
              }}
            >
              {item.meeting_room.name}
            </Typography>
            <OrangeryTag
              options={[
                {
                  label: "Meeting Room",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
              ]}
              selectedLabel={"Meeting Room"}
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                maxWidth: "80%",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Department
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  wordBreak: "break-all",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {item.meeting_room.department ?? "-"}
              </Typography>
            </Box>
            {item.meeting_room.assigned_floor && (
              <Box
                sx={{
                  dispaly: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
                >
                  Floor
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    wordBreak: "break-all",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {item.meeting_room.assigned_floor?.name ?? "-"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Host
              </Typography>
              <OrangeryUserCard4
                key={item.user.name}
                user={item.user}
                size={37}
              />
            </Box>

            {item.invitations && item.invitations?.length > 0 && (
              <ShowInvitations invitations={item.invitations} />
            )}

            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                From
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.date).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Until
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.until_time).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {item.parking_spot && (
        <>
          <Box
            sx={{
              borderBottom: "1px solid #D2D3D6",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 600,
                wordBreak: "break-all",
                maxWidth: "65%",
              }}
            >
              Parking Spot
            </Typography>
            <OrangeryTag
              options={[
                {
                  label: "Parking Spot",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
              ]}
              selectedLabel={"Parking Spot"}
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Name
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                {item.parking_spot.name ?? "-"}
              </Typography>
            </Box>
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Description
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                {item.parking_spot.description ?? "-"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            <OrangeryUserCard4 user={item.user} size={37} />
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                From
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.date).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Until
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.until_time).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* {item.desk === "private" &&
      <>
        <Box
          sx={{
            borderBottom: "1px solid #D2D3D6",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            pb: 1
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 600,
              wordBreak: "break-all",
              maxWidth: "65%"
            }}
          >
            {item.name}
          </Typography>
          <OrangeryTag
            options={[{
              label: "Private",
              colors: {
                dark: "white",
                light: "#2B2E33"
              }
            }]}
            selectedLabel={"Private"}
            height={20}
            minWidth={76}
            sx={{
              fontSize: 13,
              fontWeight: 500
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3
          }}
        >
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Room</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.room ?? "-"}</Typography>
          </Box>
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Floor</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.floor ?? "-"}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            alignItems: "center"
          }}
        >
          <Box sx={{ display: "flex" }}>
            {item.users.map((u) => (
              <OrangeryUserCircle
                key={u.name}
                name={u.name}
                fileName={u?.image}
                size={37}
              />
            ))}
          </Box>
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5,
              ml: "auto"
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Contract date</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.contract_date ?? "-"}</Typography>
          </Box>
        </Box>
      </>
    }
    {item.type === "cube" &&
      <>
        <Box
          sx={{
            borderBottom: "1px solid #D2D3D6",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            pb: 1
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 600,
              wordBreak: "break-all",
              maxWidth: "65%"
            }}
          >
            {item.name}
          </Typography>
          <OrangeryTag
            options={[{
              label: "Parking Spot",
              colors: {
                dark: "white",
                light: "#2B2E33"
              }
            }]}
            selectedLabel={"Parking Spot"}
            height={20}
            minWidth={76}
            sx={{
              fontSize: 13,
              fontWeight: 500
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            alignItems: "center"
          }}
        >
          <OrangeryUserCircle
            key={item.user.name}
            name={item.user.name}
            fileName={item.user?.image}
            size={37}
          />
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5,
              ml: "auto"
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>From</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.from ?? "-"}</Typography>
          </Box>
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Until</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.until ?? "-"}</Typography>
          </Box>
        </Box>
      </>
    } */}

      {item.desk && (
        <>
          <Box
            sx={{
              borderBottom: "1px solid #D2D3D6",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 600,
                wordBreak: "break-all",
                maxWidth: "65%",
              }}
            >
              {item.desk.name}
            </Typography>
            <OrangeryTag
              options={[
                {
                  label: "Flex Desk",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
                {
                  label: "Private",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
              ]}
              selectedLabel={item.desk.flex ? "Flex Desk" : "Private"}
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3
          }}
        >
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Floor</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.floor ?? "-"}</Typography>
          </Box>
        </Box> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Host
              </Typography>
              <OrangeryUserCard4
                key={item.user.name}
                user={item.user}
                size={37}
              />
            </Box>

            {item.invitations && item.invitations?.length > 0 && (
              <ShowInvitations invitations={item.invitations} />
            )}

            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Date
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.date).format("YYYY-MM-DD") ?? "-"}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {item.product && item.product.type === "day-pass" && (
        <>
          <Box
            sx={{
              borderBottom: "1px solid #D2D3D6",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 600,
                wordBreak: "break-all",
                maxWidth: "65%",
              }}
            >
              {item.product.name}
            </Typography>
            <OrangeryTag
              options={[
                {
                  label: "Daypass",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
              ]}
              selectedLabel={"Daypass"}
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Description
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {item.product.description || "-"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            <OrangeryUserCard4 user={item.user} size={37} />
            {/* <Box
            sx={{
              dispaly: "flex",
              flexDirection: "column",
              gap: .5,
              ml: "auto"
            }}
          >
            <Typography variant="h6" sx={{fontSize: 13, fontWeight: 600, color: "#A5AAB4"}}>Contract date</Typography>
            <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>{item.contract_date ?? "-"}</Typography>
          </Box> */}
          </Box>
        </>
      )}

      {item.product && item.product.type === "mobility" && (
        <>
          <Box
            sx={{
              borderBottom: "1px solid #D2D3D6",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 600,
                wordBreak: "break-all",
                maxWidth: "65%",
              }}
            >
              {item.product.name}
            </Typography>
            <OrangeryTag
              options={[
                {
                  label: "Mobility",
                  colors: {
                    dark: "white",
                    light: "#2B2E33",
                  },
                },
              ]}
              selectedLabel={"Mobility"}
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Description
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {item.product.description || "-"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              alignItems: "center",
            }}
          >
            <OrangeryUserCard4 user={item.user} size={37} />
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                From
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.date).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Until
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.until_time).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {item.visitor && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <OrangeryUserCard2 user={item.visitor.visitor} size={40} />
            <OrangeryTag
              options={[
                {
                  label: "Pending",
                  colors: {
                    dark: "#2B2E33",
                    light: "#FF99001A",
                  },
                },
                {
                  label: "Checked in",
                  colors: {
                    dark: "#2B2E33",
                    light: "#42B8631A",
                  },
                },
                {
                  label: "Checked out",
                  colors: {
                    dark: "#2B2E33",
                    light: "#FF99001A",
                  },
                },
              ]}
              selectedLabel={
                item.visitor.visitor?.checked_in_at
                  ? item.visitor.visitor?.checked_out_at
                    ? "Checked out"
                    : "Checked in"
                  : "Pending"
              }
              height={20}
              minWidth={76}
              sx={{
                fontSize: 13,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Host
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {item.visitor?.host?.name ?? "-"}
              </Typography>
            </Box>
            <Box
              sx={{
                dispaly: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
              >
                Arrival Time
              </Typography>
              <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                {moment(item.visitor.arrival).format("HH:mm") ?? "-"}
              </Typography>
            </Box>
            {item.visitor.host?.organization && (
              <Box
                sx={{
                  dispaly: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
                >
                  Host Company
                </Typography>
                <Typography variant="h4" sx={{ fontSize: 14, fontWeight: 700 }}>
                  {item.visitor.host?.organization ?? "-"}
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

function ShowInvitations({ invitations }) {
  return (
    <Box
      sx={{
        dispaly: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontSize: 13, fontWeight: 600, color: "#A5AAB4" }}
      >
        Attendees
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {invitations && invitations?.length === 1 ? (
          <OrangeryUserCard4
            key={invitations[0].user.name}
            user={invitations[0].user}
            size={37}
          />
        ) : (
          invitations?.map(
            (
              invitaion,
              index ////////!!!!!!!!
            ) =>
              invitaion.user &&
              index <= 2 && (
                <OrangeryUserCircle
                  key={invitaion.user?.name}
                  name={invitaion.user?.name}
                  fileName={invitaion.user?.image}
                  size={37}
                />
              )
          )
        )}
        {invitations && invitations?.length > 1 && (
          <Box
            sx={{
              ml: 3,
            }}
          >
            <OrangerySeeAllEmployeesButton
              caption={invitations.length <= 3 ? "View details" : "See more"}
              users={invitations.map((invitation) => invitation.user)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
