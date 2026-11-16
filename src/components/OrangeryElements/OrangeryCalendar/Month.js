import React, { Component } from 'react'
import moment from 'moment'
import Week from './Week'
import { defaultUtils as utils } from './dateUtils'
import { Box } from '@mui/material'

class Month extends Component {
  render() {
    return <Box
      sx={{
        width: "100%",
        height: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
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
    >
      {this.renderWeeks(this.props.displayDate)}
    </Box >
  }

  renderWeeks = () => {
    const weekArray = utils.getWeekArray(
      this.props.displayDate,
      moment.localeData().firstDayOfWeek()
    )

    return weekArray.map(
      (s, i) => (
        <Week
          schedule={this.props.schedule}
          key={i}
          week={s}
          selectedDates={this.props.selectedDates}
          disabledDates={this.props.disabledDates}
          onSelect={this.props.onSelect}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          readOnly={this.props.readOnly}
        />
      ),
      this
    )
  }
}

export default Month