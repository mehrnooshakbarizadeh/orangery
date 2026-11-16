import { Box, Fade, IconButton, Typography } from "@mui/material";
import {
  IOsAnalyticsItem,
} from "../../../../queries/apps/osAnalytics";
import {
  OrangeryDataOverviewButton,
  OrangeryPrice,
  OrangeryTooltip,
  // OrangeryAutocomplete,
  // OrangeryTag
} from "../../../OrangeryElements";
import React from "react";

// icons, images & colors
import ArrowUpIcon from "../../../../assets/svg/arrowUpFull.svg";
import ArrowDownIcon from "../../../../assets/svg/arrowDownFull.svg";
import InfoIcon from "../../../../assets/svg/i.svg";
import PercentIcon from "../../../../assets/svg/percent.svg";

import {
  BadgeDelta,
  BarChart,
  Block,
  Card,
  DeltaType,
  Flex,
  Metric,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import "@tremor/react/dist/esm/tremor.css";
import ChartOverviewButton from "./ChartOverviewButton";
import OrangeryCustomDatepicker from "./OrangeryCustomDatepicker";

const dataFormatter = (value: string | number, unit?: string) => {
  // const ref = React.createRef();
  // let thisValue = <OrangeryPrice setGetFormattedValue={setGetFormattedValue} euro={value} germanFormat />

  return unit === "€" &&
    (typeof value === "string" || typeof value === "number")
    ? // ? <OrangeryPrice euro={value} germanFormat />
    `${value}${unit ? ` ${unit}` : ""}`
    : `${value}${unit ? ` ${unit}` : ""}`;
};

export default function OsAnalyticsCard({
  item,
  editButton,
  selectedOfficeUuid,
  selectedDate,
}: {
  item: IOsAnalyticsItem;
  editButton?: JSX.Element;
  selectedOfficeUuid?: string;
  selectedDate?: string | Date;
}) {
  let isChart =
    item.type === "bar_chart" &&
    typeof item.value === "object" &&
    Array.isArray(item.value);

  let outerValue = item.value;
  const [value, setValue] = React.useState<any>(outerValue)

  function getUnitedValue(value: any) {
    return item.unit === "€" &&
      (typeof item.value === "string" || typeof item.value === "number") ? (
      <OrangeryPrice euro={item.value} germanFormat />
    ) : (
      `${item.value}${item.unit ? ` ${item.unit}` : ""}`
    );
  }
  React.useEffect(() => {
    setValue(getUnitedValue(item.value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.value])

  let deltaType = (
    item.rate
      ? parseFloat(item.rate.toString()) === 0
        ? "unchanged"
        : parseFloat(item.rate.toString()) > 0
          ? "increase"
          : "decrease"
      : "unchanged"
  ) as DeltaType;

  let arrayValues = [] as any[];
  if (item.label && isChart && Array.isArray(item.value)) {
    item.value.map((valueItem, index) => {
      let newValue = { date: valueItem.date } as any;
      newValue[item.label ?? "data"] = valueItem.data;
      arrayValues.push(newValue);
    });
  }

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  let elementId = slugify(item.name);

  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => {
    updateChartTransparency(true)
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  updateChartTransparency()
  function updateChartTransparency(smooth?: boolean) {
    const timer = setTimeout(() => {
      if (isChart && loaded) {
        let elements = Array.from((document.getElementById(elementId)?.getElementsByClassName("recharts-layer recharts-bar-rectangle") ?? []) as HTMLCollectionOf<HTMLElement>)
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i]
          if (typeof item.value !== "number" && typeof item.value !== "string" && item.value[i].transparent === true)
            element.classList.add(smooth ? "smooth-transparent" : "transparent") // , { duration: "500ms" }
        }
      }
      // 'This will run after 400 milliseconds!'
    }, 400);
    return () => clearTimeout(timer);
  }

  return (
    <Box
      id={elementId}
      sx={{
        position: "relative",
        width: isChart
          ? item.uuid === "ae888834-61d4-4ffc-9582-f74685050362"
            ? "75%"
            : item.uuid === "fb8c5d46-9073-4506-af81-952884eedddd"
              ? "30%"
              : "100%"
          : 300,
        ...(isChart
          ? {
            zoom: {
              xs: 1.25,
              xl: 1.11,
            },
          }
          : {}),
        flexGrow: 1,
        flexShrink: 1,
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 1,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {selectedDate &&
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "#2ecae5",
            }}
          >
            {(new Date(selectedDate)).toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </Typography>
        }

        {item.info_data && (
          <OrangeryDataOverviewButton
            data={item.info_data}
            color="#2ecae5"
            title="Data"
            width={1263}
            height={575}
          />
        )}

        {item.chart && (
          <ChartOverviewButton
            officeUuid={selectedOfficeUuid}
            metricUuid={item.uuid}
            unit={item.unit}
            color="#2ecae5"
            width={1263}
            height={540}
          />
        )}

        {item.info && (
          <OrangeryTooltip
            title={item.info}
            placement={isChart ? "left-start" : "bottom"}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            sx={{
              cursor: "pointer"
            }}
          >
            <IconButton
              sx={{
                "& .icon": {
                  width: "1.3rem",
                  height: "1.3rem",
                  color: "#2ecae5",
                },
              }}
            >
              <InfoIcon className="icon" />
            </IconButton>
          </OrangeryTooltip>
        )}
      </Box>

      {isChart && (
        <Card decoration="top" decorationColor="yellow">
          {/* <OrangeryTooltip
            title={item.name}
            placement="bottom"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <Box>
              <Title truncate={true}>{item.name}</Title>
            </Box>
          </OrangeryTooltip> */}
          <Box
            sx={{
              mt: 1.5
            }}
          >
            <Title truncate={true}>{item.name}</Title>
          </Box>
          <BarChart
            data={
              arrayValues && arrayValues.length > 0
                ? arrayValues
                : Array.isArray(item.value)
                  ? item.value
                  : []
            }
            dataKey={"date"}
            categories={[item.label ?? "data"]}
            colors={["yellow"]}
            valueFormatter={(number: number) =>
              dataFormatter(number, item.unit)
            }
            // marginTop="mt-6"
            // yAxisWidth="w-12"
            height={isChart ? "h-80" : "h-40"}
          />
        </Card>
      )}
      {item.type === "number" && (
        <Card decoration="top" decorationColor="yellow">
          <Block truncate={true}>
            {/* <OrangeryTooltip
              title={item.name}
              placement="right-start"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              <Box>
                <Title truncate={true}>{item.name}</Title>
              </Box>
            >
            </OrangeryTooltip> */}
            <Box
              sx={{
                mt: 1.5
              }}
            >
              <Title truncate={true}>{item.name}</Title>
            </Box>
            <Metric truncate={true}>{value}</Metric>
          </Block>
          {item.progress && item.target && (
            <Flex marginTop="mt-4" spaceX="space-x-2">
              <Text truncate={true}>
                {`${item.progress}% (`}
                {value}
                {`)`}
              </Text>
              <Text>{item.target}</Text>
            </Flex>
          )}
          {item.progress && (
            <ProgressBar percentageValue={item.progress} marginTop="mt-2" />
          )}
          <Flex alignItems="items-start" marginTop="mt-2">
            {item.rate && (
              <BadgeDelta
                deltaType={deltaType}
                text={`${item.rate} to last month`}
              />
            )}
          </Flex>
        </Card>
      )}
      {editButton && (
        <Box
          sx={{
            position: "absolute",
            top: 2,
            right: 3,
          }}
        >
          {editButton}
        </Box>
      )}
    </Box>
  );
}

function OsAnalyticsCardOld({
  name,
  subTitle,
  note,
  value,
  percentage,
  noPercentage,
  editButton,
}: {
  name: string;
  subTitle?: string;
  note?: string;
  value: number | JSX.Element;
  percentage?: string;
  noPercentage?: boolean;
  editButton?: JSX.Element;
}) {
  const positiveOrNegative = percentage?.includes("-") ? false : true;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 418,
          height: 261,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "start",
          py: 2,
          px: 2,
          border: "1px solid #C9CCD2",
          borderRadius: 3,
          // mb: 1.2,
          mx: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            {name}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: "#55585C",
            }}
          >
            {note ?? ""}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: 20,
            gap: 0.25,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: "#55585C",
            }}
          >
            {subTitle ?? ""}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 63,
            fontWeight: 700,
            my: "auto",
            alignSelf: "center",
          }}
        >
          {value}
        </Typography>

        {!noPercentage && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 40,
              gap: 0.25,
            }}
          >
            {percentage !== undefined && percentage !== "" && (
              <>
                {positiveOrNegative ? (
                  <ArrowUpIcon style={{ height: 10 }} />
                ) : (
                  <ArrowDownIcon style={{ height: 10 }} />
                )}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      color: positiveOrNegative ? "#09C176" : "#C10909",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {percentage}
                  </Typography>
                  <Box>
                    <PercentIcon
                      style={{
                        height: 10,
                        color: positiveOrNegative ? "#09C176" : "#C10909",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: positiveOrNegative ? "#09C176" : "#C10909",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {" "}
                    to last month
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        )}

        {editButton && (
          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              right: 6,
            }}
          >
            {editButton}
          </Box>
        )}
      </Box>
    </>
  );
}