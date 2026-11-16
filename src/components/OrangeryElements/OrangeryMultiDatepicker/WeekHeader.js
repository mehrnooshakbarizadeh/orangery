import React from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'

const Week = props => <Typography variant='overline' color='textSecondary' {...props} />

const WeekHeader = () => {
  // not working!?
  moment.locale('de-de')
  const weekdayNames = moment.localeData("de-de").weekdaysShort(true);

  // const weekdayNames = [
  //   "MON",
  //   "DIE",
  //   "MIT",
  //   "DON",
  //   "FRE",
  //   "SAM",
  //   "SON",
  // ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        marginBottom: 1,
        '& > *': {
          width: 36,
          margin: {
            xs: `0 2px`,
            sm: `0 ${8}px`
          },
        }
      }}
    >
      {weekdayNames.map(name => (
        <Week key={name}>{name}</Week>
      ))}
    </Box>
  )
}

export default WeekHeader
