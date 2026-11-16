// react & next
import React from "react";

// external dependencies
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import {
  BadgeDelta,
  DateRangePicker,
  DeltaType,
} from "@tremor/react"

// orangery elements & internal dependencies
import {
  OrangeryCloseButton,
  OrangeryFilter,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangeryLineChart
} from "../../../OrangeryElements"

// queries & backend
import {
  IChartItem,
  useOsAnalyticsMetricChart
} from "../../../../queries/apps/osAnalytics";

// icons, images & colors
import ChartIcon from "../../../../assets/svg/apps/osAnalytics/chart-mixed-regular.svg";
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import { Observer } from "mobx-react-lite";

export default function ChartOverviewButton({
  officeUuid,
  metricUuid,
  unit,
  disabled,
  color,
  height,
  width,
}: {
  officeUuid?: string;
  metricUuid: string;
  unit?: string;
  disabled?: boolean;
  color?: string;
  height?: string | number;
  width?: string | number;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => handleOpen()}
        disabled={disabled}
        sx={{
          "& > *:first-of-type": { mx: 0 },
          "& .icon": {
            width: "1.3rem",
            height: "1.3rem",
            color: color ?? "primary.main",
          },
          "& .MuiButton-root": { minWidth: 40 },
        }}
      >
        <ChartIcon className="icon" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            maxWidth: width ? width : 900,  ////////!!!!!!!!
            width: width ?? 900,
            height: {
              xs: "none",
              sm: height ?? 720,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
          }}
        >
          {open &&
            <DialogOverviewContent
              officeUuid={officeUuid}
              metricUuid={metricUuid}
              // label={ }
              unit={unit}
              handleClose={handleClose}
            />
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

export class ListState {
  public noFilter: boolean = false;
  public filterByDate: string[] = ["All"];

  constructor() {
    makeAutoObservable(this);
  }

  pushToFilterByDateList(value: string) {
    if (this.filterByDate.includes(value)) {
      return;
    }
    this.filterByDate.push(value);
  }

  deleteFromFilterByDateList(value: number) {
    this.filterByDate.splice(value, 1);
  }
}

function getManipulatedList(
  data: IChartItem[],
  filterByDate: string[],
) {
  let dataList = [...data]; ////////!!!!!!!! should be deep copy
  if (filterByDate) {
    dataList = handleFilterByDate(dataList, filterByDate);
  }
  return dataList;
}

function handleFilterByDate(data: IChartItem[], filterByDate: string[]) {
  let filteredList = [...data];
  filterByDate.forEach((v, j) => {
    if (v === "All") {
    }
    else if (v === "1D")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-1),
        new Date()
      );
    else if (v === "7D")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-7),
        new Date()
      );
    else if (v === "30D")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-30),
        new Date()
      );
    else if (v === "90D")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-90),
        new Date()
      );
    else if (v === "365D")
      filteredList = filterByDateInterval(
        filteredList,
        calculateDate(-365),
        new Date()
      );
  });

  return filteredList;
}

function calculateDate(
  daysOffset: number,
  monthsOffset?: number,
  yearsOffset?: number
) {
  let temp: any = new Date();

  if (yearsOffset !== undefined) {
    temp = new Date(
      temp.getFullYear() + yearsOffset + "-" + "01" + "-" + "01" + " 00:00:00"
    );
    return temp;
  }

  if (monthsOffset !== undefined) {
    if (temp.getMonth() + 1 + monthsOffset > 0)
      temp = new Date(
        temp.getFullYear() +
        "-" +
        (temp.getMonth() + 1 + monthsOffset) +
        "-" +
        "01" +
        " 00:00:00"
      );
    else
      temp = new Date(
        temp.getFullYear() -
        1 +
        "-" +
        (temp.getMonth() + 1 + monthsOffset + 12) +
        "-" +
        "01" +
        " 00:00:00"
      );

    return temp;
  }

  temp = new Date(temp.getTime() + daysOffset * 24 * 3600 * 1000);
  temp = new Date(
    temp.getFullYear() +
    "-" +
    (temp.getMonth() + 1) +
    "-" +
    temp.getDate() +
    " 00:00:00"
  );
  return temp;
}

function filterByDateInterval(data: IChartItem[], minDate: Date, maxDate: Date) {
  return data.filter(
    (item) =>
      new Date(item.date) >= minDate &&
      new Date(item.date) <= maxDate
  );
}

function DialogOverviewContent({
  officeUuid,
  metricUuid,
  label,
  unit,
  handleClose,
}: {
  officeUuid?: string;
  metricUuid: string;
  label?: string;
  unit?: string;
  handleClose: () => void;
}) {
  const {
    data: rowData,
    isLoading
  } = useOsAnalyticsMetricChart({
    office_uuid: officeUuid,
    metric_uuid: metricUuid
  });

  const listState = React.useMemo(() => new ListState(), []);

  const [data, setData] = React.useState<any[] | undefined>(undefined)
  let tempLabeledData = [] as any[];
  async function getMetricChartData() {
    if (label) {
      rowData?.map((valueItem) => {
        let newValue = { date: valueItem.date } as any;
        newValue[label ?? "value"] = valueItem.data;
        tempLabeledData.push(newValue);
      });
    }

    setData(tempLabeledData && tempLabeledData.length > 0
      ? tempLabeledData
      : Array.isArray(rowData)
        ? rowData
        : []
    )
  }
  React.useEffect(() => {
    getMetricChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData])

  return <Box
    sx={{
      height: "100%",
      overflowY: "hidden",
    }}
  >
    <Box
      sx={{
        pr: 3,
        pl: 4,
        py: 2.5,
        // pb: 1,
        // pt: 2.5,
        mb: 0,
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        borderBottom: (theme) => `1px solid #EDEEF0`,
      }}
    >
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80%",
          color: "#2B2E33"
        }}
      >
        {"History"}
      </Typography>
      <OrangeryCloseButton onClose={handleClose} noAbsolute />
    </Box>

    <Box
      sx={{
        backgroundColor: "white",
        pl: 0,
        pr: 5,
        ml: 2,
        mr: 1.5,
        py: 0,
        my: 1,
        position: "relative",
        borderRadius: 1,
        // height: "calc(100% - 110px)",
      }}
    >
      {
        isLoading
          ? <OrangeryNavigationContentLoader />
          : data && data.length > 0
            ? <Observer>
              {() => {
                const manipulatedList = getManipulatedList(
                  data,
                  listState.filterByDate,
                );

                let rate = manipulatedList && manipulatedList.length > 0 && parseFloat(manipulatedList[manipulatedList.length - 1]?.value?.toString() ?? "0") !== 0
                  ? ((parseFloat(manipulatedList[manipulatedList.length - 1]?.value?.toString() ?? "0") - parseFloat(manipulatedList[0]?.value?.toString() ?? "0")) / parseFloat(manipulatedList[manipulatedList.length - 1]?.value?.toString() ?? "0") * 100).toFixed(2)
                  : undefined;
                let deltaType = (
                  rate
                    ? parseFloat(rate.toString()) === 0
                      ? "unchanged"
                      : parseFloat(rate.toString()) > 0
                        ? "increase"
                        : "decrease"
                    : "unchanged"
                ) as DeltaType;

                return manipulatedList && manipulatedList.length > 0
                  ? <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 60,
                        right: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <OrangeryLineChart
                        data={manipulatedList}
                        label={label}
                        unit={unit}
                      />
                    </Box>

                    {rate !== undefined &&
                      <Box
                        sx={{
                          position: "absolute",
                          top: 60,
                          right: 4,
                        }}
                      >
                        <BadgeDelta
                          deltaType={deltaType}
                          text={`${rate} %`}
                        />
                      </Box>
                    }

                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        alignItems: "center",
                      }}
                    >
                      <OrangeryFilter
                        // multiSelect
                        horizontal
                        width={300}
                        selectedValues={listState.filterByDate}
                        options={[
                          "1D",
                          "7D",
                          "30D",
                          "90D",
                          "365D",
                          "All",
                        ]}
                        onChange={(newValues) => {
                          newValues.forEach((e: any) => {
                            const i = listState.filterByDate.findIndex((v) => v === e);
                            if (i === -1) {
                              listState.pushToFilterByDateList(e);
                            }
                          });
                          [...listState.filterByDate].forEach((v) => {
                            const i = newValues.findIndex((e: any) => v === e);
                            if (i === -1) {
                              const j = listState.filterByDate.findIndex((t) => t === v);
                              listState.deleteFromFilterByDateList(j);
                            }
                          });
                        }}
                      />
                    </Box>
                  </Box>
                  : <OrangeryNavigationPlaceholder
                    vertical
                    title={"No Data!"}
                    subtitle={"Please filter some other date."}
                    PlaceholderSvg={PlaceholderSvg}
                    width={213}
                    height={224}
                  />
              }}
            </Observer>
            : <OrangeryNavigationPlaceholder
              vertical
              width={213}
              height={224}
              title={"No Data!"}
              subtitle={""}
              PlaceholderSvg={PlaceholderSvg}
              AddNewButton={<></>}
              addNewButtonText={""}
            />
      }
    </Box>
  </Box >
}