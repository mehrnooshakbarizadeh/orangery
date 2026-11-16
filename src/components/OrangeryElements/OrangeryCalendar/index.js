import React, { useRef, useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import WeekHeader from './WeekHeader'
import Month from './Month'
import { defaultUtils as utils } from './dateUtils'
import CalendarToolbar from './CalendarToolbar'
import moment from 'moment'
// import { ISchedule } from "../../../queries/schedule"

import { Box } from "@mui/material";

const OrangeryCalendar = ({
  // maxDate,
  // minDate,
  disabledDates: outerDisableDates,
  disablePast,
  readOnly,
  schedule,
  // selectedMonth,
  // setSelectedMonth
}) => {
  const calendar = useRef(null)

  const [disabledDates, setDisabledDates] = useState(outerDisableDates)
  useEffect(() => {
    setDisabledDates(outerDisableDates)
  }, [outerDisableDates])

  const [displayDate, setDisplayDate] = useState(() =>
    utils.getFirstDayOfMonth(new Date())
  )

  const handleDisablePast = (date) => {
    let today = new Date()
    if (disablePast)
      if (date.getMonth() === today.getMonth()) {
        setDisabledDates([...Array(today.getDate() - 1).keys()].map(x => ++x).map((day) => new Date(date.getFullYear(), date.getMonth(), day)))
      }
      else if (date.getMonth() < today.getMonth()) {
        let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setDisabledDates([...Array(lastDayOfMonth.getDate()).keys()].map(x => ++x).map((day) => new Date(date.getFullYear(), date.getMonth(), day)))
      }
      else { }
  }

  const handleMonthChange = months => {
    let newDate = utils.addMonths(displayDate, months)
    handleDisablePast(newDate)

    setDisplayDate(displayDate => utils.addMonths(displayDate, months));

    // setSelectedMonth(moment(newDate).format("YYYY-MM"))
  }

  // maxDate = maxDate || utils.addYears(new Date(), 100)
  // minDate = minDate || utils.addYears(new Date(), -100)
  let maxDate = utils.addYears(new Date(), 100)
  let minDate = utils.addYears(new Date(), -100)

  const toolbarInteractions = {
    prevMonth: utils.monthDiff(displayDate, minDate) > 0,
    nextMonth: utils.monthDiff(displayDate, maxDate) < 0
  }

  return (
    <Box
      sx={{
        // marginTop: 16
        // boxShadow: 'inset 0 0 10px #000000'
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        height: { ////////!!!!!!!! should be revised
          xs: "calc(100% - 38px)",
          sm: "100%"
        },
      }}
    >
      <CalendarToolbar
        displayDate={displayDate}
        onMonthChange={handleMonthChange}
        prevMonth={toolbarInteractions.prevMonth}
        nextMonth={toolbarInteractions.nextMonth}
      />
      <WeekHeader />
      <Month
        schedule={schedule}
        displayDate={displayDate}
        key={displayDate.toDateString()}
        disabledDates={disabledDates}
        minDate={minDate}
        maxDate={maxDate}
        readOnly={readOnly}
        ref={calendar}
      />
    </Box>
  )
}

export default OrangeryCalendar

OrangeryCalendar.propTypes = {
  schedule: PropTypes.array,
  // maxDate: PropTypes.date,
  // minDate: PropTypes.date,
  disabledDates: PropTypes.arrayOf(PropTypes.date),
  disablePast: PropTypes.bool,
  readOnly: PropTypes.bool,
  selectedMonth: PropTypes.string,
  // setSelectedMonth: PropTypes.func,
}