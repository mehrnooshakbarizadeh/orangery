import React, { Component } from 'react'
import DateUtilities from './utils'
import { dateTimeFormat } from './dateUtils'
import { Grid, Box } from '@mui/material'
import Day from './Day'
import moment from 'moment'

class Week extends Component {
  isDisabled = day => {
    if (this.props.readOnly) return true

    const disabledDate = this.props.disabledDates && this.props.disabledDates.find(d => DateUtilities.isSameDay(d, day))
    if (disabledDate != null) return true

    let minDate = this.props.minDate

    let maxDate = this.props.maxDate

    return (
      (minDate && DateUtilities.isBefore(day, minDate)) ||
      (maxDate && DateUtilities.isAfter(day, maxDate))
    )
  }

  isSelected = day =>
    this.props.selectedDates && DateUtilities.dateIn(this.props.selectedDates, day)

  render() {
    const { classes } = this.props

    const dateInNumberic = new dateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })

    const dateToday = dateInNumberic.format(new Date())

    const dayInNumeric = new dateTimeFormat('en-US', {
      day: 'numeric'
    })

    return (
      <Grid
        container
        columns={{ xs: 1, md: 7 }}
        sx={{
          width: "100%",
          flexGrow: {
            xs: "unset",
            md: 1
          },
          px: 1,
          py: .25,
          height: {
            xs: "auto",
            md: 10,  // just for equaling the height of each row, flexGrow will override it,
          },
          minHeight: {
            xs: "auto",
            md: 107,
          },
        }}
      >
        {this.props.week.map((day, i) => {
          if (day) {
            // let summaryScheduleOfThisDay = [];
            // if (this.props.schedule && Array.isArray(this.props.schedule))
            //   summaryScheduleOfThisDay = this.props.schedule.filter((summarySchedule) => summarySchedule.date === moment(day).format("YYYY-MM-DD"))
            // if (summaryScheduleOfThisDay && summaryScheduleOfThisDay.length > 0)
            //   summaryScheduleOfThisDay = summaryScheduleOfThisDay[0]
            // else
            //   summaryScheduleOfThisDay = {}

            const isToday = day && dateToday === dateInNumberic.format(day)
            const isDisabled = this.isDisabled(day)
            const isSelected = this.isSelected(day)

            return (
              <Day
                key={`day-${day}`}
                schedule={this.props.schedule}
                label={moment(day).format("DD")}
                disabled={isDisabled}
                isToday={isToday}
                day={day}
                style={{
                  margin: `0 4px`,
                  // margin: {
                  //   xs: `0 2px`,
                  //   sm: `0 ${8}px`,
                  // }
                }}
              />
            )

            // return (
            //   <DayButton
            //     key={`day-${day}`}
            //     onClick={e => {
            //       e.preventDefault()
            //       this.onSelect(day)
            //     }}
            //     disabled={isDisabled}
            //     selected={isSelected}
            //   >
            //     <DayBackdrop selected={isSelected} />
            //     <Day selected={isSelected} disabled={isDisabled} today={isToday}>
            //       {dayInNumeric.format(day)}
            //     </Day>
            //   </DayButton>
            // )
          }
          return <Day
            key={`blank-${i}`}
            label={""}
            disabled={true}
            isToday={false}
            style={{
              margin: `0 4px`,
              // margin: {
              //   xs: `0 2px`,
              //   sm: `0 ${8}px`,
              // }
            }}
          />
        })}
      </Grid>
    )
  }
}

export default Week