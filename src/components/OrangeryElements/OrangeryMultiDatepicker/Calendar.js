import React, { useRef, useCallback, useState, useEffect } from 'react'
import WeekHeader from './WeekHeader'
import Month from './Month'
import { defaultUtils as utils } from './dateUtils'
import CalendarToolbar from './CalendarToolbar'
import CalendarButtons from './CalendarButtons'
import DateDisplay from './DateDisplay'

import { Box } from "@mui/material";

const Calendar = ({
  initialDate,
  maxDate,
  minDate,
  selectedDates,
  disabledDates: outerDisableDates,
  disablePast,
  onSelect,
  onCancel,
  onOk,
  readOnly,
  onRemoveAtIndex,
  cancelButtonText,
  submitButtonText,
  selectedDatesTitle,
  preventRemoveLast
}) => {
  const calendar = useRef(null)

  const [disabledDates, setDisabledDates] = useState(outerDisableDates)
  useEffect(() => {
    setDisabledDates(outerDisableDates)
  }, [outerDisableDates])

  const [displayDate, setDisplayDate] = useState(() =>
    utils.getFirstDayOfMonth(initialDate || new Date())
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
  }

  useEffect(
    () => {
      let newDate = utils.getFirstDayOfMonth(initialDate || new Date())
      setDisplayDate(newDate)
      handleDisablePast(newDate)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialDate]
  )

  maxDate = maxDate || utils.addYears(new Date(), 100)
  minDate = minDate || utils.addYears(new Date(), -100)

  const toolbarInteractions = {
    prevMonth: utils.monthDiff(displayDate, minDate) > 0,
    nextMonth: utils.monthDiff(displayDate, maxDate) < 0
  }

  return (
    <Box
      sx={{
        flex: '1',
        display: 'flex',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          // marginTop: 16
          // boxShadow: 'inset 0 0 10px #000000'
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            padding: `0 ${8}px`
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
            displayDate={displayDate}
            key={displayDate.toDateString()}
            selectedDates={selectedDates}
            disabledDates={disabledDates}
            minDate={minDate}
            maxDate={maxDate}
            onSelect={onSelect}
            readOnly={readOnly}
            ref={calendar}
          />
        </Box>
        <CalendarButtons
          readOnly={readOnly}
          onCancel={onCancel}
          onOk={onOk}
          cancelButtonText={cancelButtonText}
          submitButtonText={submitButtonText}
        />
      </Box>
      <DateDisplay
        selectedDatesTitle={selectedDatesTitle}
        selectedDates={selectedDates}
        readOnly={readOnly}
        onRemoveAtIndex={onRemoveAtIndex}
        preventRemoveLast={preventRemoveLast}
      />
    </Box>
  )
}

export default Calendar
