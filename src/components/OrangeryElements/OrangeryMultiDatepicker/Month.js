import React, { Component } from 'react'
import moment from 'moment'
import Week from './Week'
import { defaultUtils as utils } from './dateUtils'
import { Box } from '@mui/material'

class Weeks extends Component {
  render() {
    return <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        // height: 214,
        lineHeight: '1.25',
        position: 'relative'
      }}
    >
      {this.renderWeeks(this.props.displayDate)}
    </Box>
  }

  renderWeeks = () => {
    const weekArray = utils.getWeekArray(
      this.props.displayDate,
      moment.localeData().firstDayOfWeek()
    )

    return weekArray.map(
      (s, i) => (
        <Week
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

export default Weeks
