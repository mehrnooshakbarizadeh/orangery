import React, { Component } from 'react'
import DateUtilities from './utils'
import { dateTimeFormat } from './dateUtils'
import { Box } from '@mui/material'
import Circle from './Circle'

class Week extends Component {
  onSelect = day => {
    if (!this.isDisabled(day)) this.props.onSelect(day)
  }

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 34,
          marginBottom: 2
        }}
      >
        {this.props.week.map((day, i) => {
          if (day) {
            const isToday = day && dateToday === dateInNumberic.format(day)
            const isDisabled = this.isDisabled(day)
            const isSelected = this.isSelected(day)

            return (
              <Circle
                key={`day-${day}`}
                label={dayInNumeric.format(day)}
                disabled={isDisabled}
                checked={isSelected}
                onCheck={e => {
                  this.onSelect(day)
                }}
                isToday={isToday}
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
          return <Box
            key={`blank-${i}`}
            sx={{
              width: 36,
              height: 36,
              margin: `0 4px`,
              // margin: {
              //   xs: `0 2px`,
              //   sm: `0 ${8}px`
              // },
            }}
          />
        })}
      </Box>
    )
  }
}

export default Week
