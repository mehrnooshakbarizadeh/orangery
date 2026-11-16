import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, IconButton, Typography } from '@mui/material'
import { capitalizeFirstLetter } from './utils'

// icons, images & colors
import ArrowLeftIcon from "../../../assets/svg/schedule/ArrowLeft.svg"
import ArrowRightIcon from "../../../assets/svg/schedule/ArrowRight.svg"

class CalendarToolbar extends Component {
  static propTypes = {
    displayDate: PropTypes.object.isRequired,
    nextMonth: PropTypes.bool,
    onMonthChange: PropTypes.func,
    prevMonth: PropTypes.bool
  }

  static defaultProps = {
    nextMonth: true,
    prevMonth: true
  }

  handleTouchTapPrevMonth = e => {
    if (e)
      e.preventDefault()

    if (this.props.onMonthChange) {
      this.props.onMonthChange(-1)
    }
  }

  handleTouchTapNextMonth = e => {
    e.preventDefault()
    if (this.props.onMonthChange) {
      this.props.onMonthChange(1)
    }
  }

  render() {
    const { displayDate } = this.props

    const dateTimeFormatted = new Date(displayDate).toLocaleString("de-DE", {
      month: "long",
      year: "numeric",
    })
    // const dateTimeFormatted = new dateTimeFormat('en-US', {
    //   month: 'long',
    //   year: 'numeric'
    // }).format(displayDate)

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'space-between',
          margin: `${8}px 0`
        }}
      >
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevMonth}
          sx={{
            "& .icon": {
              width: "1.1rem",
              height: "1.1rem",
            },
            "&.MuiIconButton-root": { p: 1.5 },
          }}
        >
          <ArrowLeftIcon className="icon" />
        </IconButton>
        <Typography variant='subtitle1'>{capitalizeFirstLetter(dateTimeFormatted)}</Typography>
        <IconButton
          disabled={!this.props.nextMonth}
          onClick={this.handleTouchTapNextMonth}
          sx={{
            "& .icon": {
              width: "1.1rem",
              height: "1.1rem",
            },
            "&.MuiIconButton-root": { p: 1.5 },
          }}
        >
          <ArrowRightIcon className="icon" />
        </IconButton>
      </Box>
    )
  }
}

export default CalendarToolbar
