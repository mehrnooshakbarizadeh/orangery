// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";

// react & next
import React, { useState, useEffect } from "react";

// external dependencies
import moment from 'moment'

// orangery elements & internal dependencies
import {
  OrangeryNavigationContentLoader,
  OrangeryCalendar
} from "../../OrangeryElements";

// queries & backend
import {
  useOfficeSchedule,
} from "../../../queries/schedule";

export default function ScheduleNav() {
  useEffect(() => {
    document.querySelector<HTMLInputElement>("main")!.style.backgroundColor = "white"
  }, []);

  const { office_uuid } = useGlobalState();
  const {
    data: schedule,
    isLoading,
    isError,
  } = useOfficeSchedule(office_uuid);

  // const [selectedMonth, setSelectedMonth] = React.useState(moment(new Date()).format("YYYY-MM"))

  return (
    <>{isLoading
      ? <OrangeryNavigationContentLoader />
      : <OrangeryCalendar
        // selectedMonth={selectedMonth}
        // setSelectedMonth={onMonthChange}
        schedule={schedule}
      />
    }</>
  );
}