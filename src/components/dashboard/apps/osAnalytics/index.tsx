// 
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";

// 
import React from "react";

// 
import { Box, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

// 
import {
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  // OrangeryAutocomplete,
  // OrangeryTag
} from "../../../OrangeryElements";
import OsAnalyticsCard from "./OsAnalyticsCard";

// 
import {
  IOsAnalyticsItem,
  useOsAnalyticsMutation,
} from "../../../../queries/apps/osAnalytics";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import OsAnalyticsLogo from "../../../../assets/svg/apps/osAnalytics/osAnalyticsLogo.svg";

import {
  SelectBox,
  SelectBoxItem,
} from "@tremor/react";
import "@tremor/react/dist/esm/tremor.css";
import { useOffices } from "../../../../queries/office";
import TrasnactionsListButton from "./TrasnactionsListButton";
import SettingsButton from "./SettingsButton";

export default function OsAnalyticsNav() {
  const globalState = useGlobalState();

  const [selectedOfficeUuid, setSelectedOfficeUuid] = React.useState<string>(
    globalState.office_uuid
  );
  const {
    data: offices,
    isLoading: officesIsLoading,
  } = useOffices();

  // const {
  //   data: osAnalytics,
  //   isLoading,
  //   isError,
  // } = useOsAnalytics(selectedOfficeUuid);

  const [osAnalytics, setOsAnalytics] = React.useState<IOsAnalyticsItem[] | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(true)

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  function handleDateChange(newValue: Date | undefined) {
    setSelectedDate(newValue);
  }

  const osAnalyticsMutation = useOsAnalyticsMutation();
  async function handleUpdateOsAnalytics(date?: string) {
    setOsAnalytics(await osAnalyticsMutation.mutateAsync({
      office_uuid: selectedOfficeUuid,
      ...(date ? { date } : {})
    }))
    setIsLoading(false);
  }

  React.useEffect(() => {
    setIsLoading(true);
    if (selectedDate)
      handleUpdateOsAnalytics(
        selectedDate.toLocaleDateString("en-US", { year: 'numeric' }) + "-" + selectedDate.toLocaleDateString("en-US", { month: 'numeric' }) + "-" + selectedDate.toLocaleDateString("en-US", { day: 'numeric' }))
    else
      handleUpdateOsAnalytics();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedOfficeUuid])

  return (
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
        }}
      >
        <Box
          sx={{
            mr: "auto",
          }}
        >
          <OsAnalyticsLogo />
        </Box>

        {/* <Box
          sx={{
            width: 170,
            ml: "auto",
            mr: 2,
            "& .MuiFormControl-root": {
              height: 38
            },
            "& .MuiOutlinedInput-root": {
              height: "100%"
            },
            "& .MuiOutlinedInput-input": {
              pt: 0,
              pb: 0,
              alignItems: "center",
              display: "flex",
            },
            "& .MuiButtonBase-root": {
              p: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              height: 38,
              top: 0
            },
            "& legend": {
              display: "none",
            },
          }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="dd.MM.yyyy"
              value={selectedDate}
              onChange={(newValue: any) => {
                handleDateChange(newValue);
              }}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </LocalizationProvider>
        </Box> */}

        {!officesIsLoading && (
          <Box
            sx={{
              minWidth: 200,
              "& button": {
                border: "none !important",
              },
            }}
          >
            <SelectBox
              defaultValue={selectedOfficeUuid}
              handleSelect={(newValue) => {
                setSelectedOfficeUuid(newValue);
              }}
              placeholder="All locations"
              maxWidth="max-w-none"
              marginTop="mt-0"
            >
              {[
                { label: "All locations", value: undefined },
                ...(offices
                  ? offices.map((office) => ({
                    label: office.name,
                    value: office.uuid,
                  }))
                  : []),
              ].map((option) => (
                <SelectBoxItem
                  key={option.value}
                  value={option.value}
                  text={option.label}
                  icon={undefined}
                />
              ))}
            </SelectBox>
          </Box>
        )}

        <TrasnactionsListButton
          selectedOffice={
            selectedOfficeUuid
              ? offices?.filter(
                (office) => office.uuid === selectedOfficeUuid
              )[0]
              : undefined
          }
        />

        <SettingsButton
          selectedOffice={
            selectedOfficeUuid
              ? offices?.filter(
                (office) => office.uuid === selectedOfficeUuid
              )[0]
              : undefined
          }
        />
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
          height: `calc(100% - 56px)`,
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
        {isLoading ? (
          <OrangeryNavigationContentLoader />
        ) : osAnalytics && osAnalytics.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "row",
                  md: "row",
                },
                flexWrap: {
                  xs: "wrap",
                  md: "unset",
                },
                gap: 2.5,
                width: "100%",
              }}
            >
              {osAnalytics
                .filter(
                  (item) => item.type === "bar_chart" && item.display !== false
                )
                .map((item: any) => (
                  <OsAnalyticsCard
                    key={item.uuid}
                    item={item}
                    selectedOfficeUuid={selectedOfficeUuid}
                  // selectedOfficeUuid={selectedOfficeUuid} // no need to this line in charts
                  // editButton={<EditButton />}
                  />
                ))}
            </Box>
            {osAnalytics
              .filter(
                (item) => item.type !== "bar_chart" && item.display !== false
              )
              .map((item: any) => (
                <OsAnalyticsCard
                  key={item.uuid}
                  item={item}
                  selectedOfficeUuid={selectedOfficeUuid}
                  selectedDate={selectedDate}
                // editButton={<EditButton />}
                />
              ))}
          </>
        ) : (
          <OrangeryNavigationPlaceholder
            vertical
            title={"No Analytics!"}
            subtitle={""}
            PlaceholderSvg={PlaceholderSvg}
            width={213}
            height={224}
          />
        )}
      </Box>
    </Box>
  );
}