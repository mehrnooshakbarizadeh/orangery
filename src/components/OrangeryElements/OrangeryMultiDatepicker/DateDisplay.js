import React, { Component } from 'react'
import { Box, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material'
import moment from 'moment'

import CloseIcon from "@mui/icons-material/Close";

class DateDisplay extends Component {
  state = {
    selectedYear: false
  }

  componentDidMount() {
    if (!this.props.monthDaySelected) {
      this.setState({ selectedYear: true })
    }
  }

  getFormatedDate = date => {
    // const dateTime = new dateTimeFormat('en-US', {
    //   year: 'numeric',
    //   month: 'short',
    //   day: '2-digit'
    // }).format(date)

    // return `${dateTime}`

    return moment(date).format('ll')
  }

  removeDateAtIndex = index => () => {
    this.props.onRemoveAtIndex(index)
  }

  render() {
    const { selectedDates, readOnly } = this.props

    return (
      <Box
        sx={{
          width: 240,
          backgroundColor: "#FAFBFC",
          display: 'flex',
          flexDirection: 'column',
          display: {
            xs: 'none',
            sm: "inline-block"
          }
        }}
      >
        <Box
          sx={{
            margin: 2,
            // width: '100%',
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='subtitle1'>{this.props.selectedDatesTitle}</Typography>
          {/* <Typography variant='subtitle1' color={readOnly ? 'textSecondary' : 'primary'}>
            {selectedDates.length}
          </Typography> */}
        </Box>
        <List
          dense
          sx={{
            flex: '1',
            mr: 1,
            overflowY: 'auto',
            height: "calc(100% - 70px)",
            maxHeight: "calc(100% - 46px)",
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
          {selectedDates.map((date, index) => (
            <ListItem
              key={`${date.toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}`}
              button={readOnly}
              disabled={readOnly || (this.props.preventRemoveLast && selectedDates.length === 1)}
              onClick={this.removeDateAtIndex(index)}
            >
              <ListItemText primary={this.getFormatedDate(date)} />
              {!readOnly &&
                <IconButton
                  size={"small"}
                  sx={{
                    "& .icon": { width: "1rem", height: "1rem" },
                  }}
                >
                  <CloseIcon className="icon" />
                </IconButton>
              }
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }
}

export default DateDisplay
