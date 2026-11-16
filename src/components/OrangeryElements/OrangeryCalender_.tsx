// react & next
import React, { useState } from "react";

// external dependencies
import {
  Box,
  Typography,
  IconButton,
  Grid
} from "@mui/material";

// icons, images & colors
import ArrowLeftIcon from "../../assets/svg/schedule/ArrowLeft.svg"
import ArrowRightIcon from "../../assets/svg/schedule/ArrowRight.svg"

export default function OrangeryCalendar({
  selectedMonth,
  onMonthChange,
  schedule,
}: {
  selectedMonth: string;
  onMonthChange: (selectedMonth: string) => void;
  schedule?: any;
}) {
  return <Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 1,
      height: "100%"
    }}
  >
    <MonthSelector
      selectedMonth={selectedMonth}
      onMonthChange={onMonthChange}
    />
    <Weeks schedule={schedule} />
  </Box>;
}


function MonthSelector({
  selectedMonth,
  onMonthChange
}: {
  selectedMonth: string;
  onMonthChange: (selectedMonth: string) => void;
}) {
  return <Box
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
        alignItems: "center"
      }}
    >
      <IconButton
        onClick={() => { onMonthChange("2022-07") }}  ////////!!!!!!!!
        sx={{
          "& .icon": {
            width: "1.3rem",
            height: "1.3rem",
          },
          "&.MuiIconButton-root": { p: 1.5 },
        }}
      >
        <ArrowLeftIcon className="icon" />
      </IconButton>
      <Typography
        sx={{
          fontSize: 25,
          fontWeight: 600
        }}
      >
        {selectedMonth}
      </Typography>
      <IconButton
        onClick={() => { onMonthChange("2022-09") }}  ////////!!!!!!!!
        sx={{
          "& .icon": {
            width: "1.3rem",
            height: "1.3rem",
          },
          "&.MuiIconButton-root": { p: 1.5 },
        }}
      >
        <ArrowRightIcon className="icon" />
      </IconButton>
    </Box>
  </Box>
}

function Weeks({
  schedule,
}: {
  schedule?: any;
}) {

  return (
    <Grid
      container
      columns={{ xs: 1, sm: 7 }}
      sx={{
        width: "100%",
        flexGrow: 1,
        p: 1,
      }}
    >
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>

      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>

      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>

      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>

      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>

      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
      <Grid
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
            borderRadius: 2,
            backgroundColor: "#EBF0F8",
          }}
        >
          1
        </Box>
      </Grid>
    </Grid>
  );
}