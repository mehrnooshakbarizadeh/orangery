import React from 'react'
import { Box, Typography, Grid } from '@mui/material'

const Week = props => <Typography
  sx={{
    fontSize: 21,
    fontWeight: 700
  }}
  {...props}
/>

const WeekHeader = () => {
  // not working!?
  // moment.locale('de')
  // const weekdayNames = moment.localeData("de").weekdaysShort(true);

  const weekdayNames = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];

  // const weekdayNames = [  // German
  //   "MON",
  //   "DIE",
  //   "MIT",
  //   "DON",
  //   "FRE",
  //   "SAM",
  //   "SON",
  // ];

  return (
    <Grid
      container
      columns={{ xs: 1, sm: 7 }}
      sx={{
        width: "100%",
        flexGrow: 1,
        px: 1,
        py: .5,
        textAlign: "center",
        display: {
          xs: "none",
          md: "flex"
        }
      }}
    >
      {weekdayNames.map(name => (
        <Grid
          key={name}
          item
          xs={1}
          sx={{
            p: .5
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Week>{name}</Week>
            {/* <Typography
              color='inherit'
              variant='body1'
              style={{
                textAlign: 'center',
                ...(checked
                  ? {
                    color: "white"
                  }
                  : {}
                )
              }}
            >
              {label}
            </Typography> */}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default WeekHeader
