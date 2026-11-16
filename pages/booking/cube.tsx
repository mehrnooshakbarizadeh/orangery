// contexts & globals
//

// react & next
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import React from "react"

// 
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// orangery elements & internal dependencies
//

// queries & backend
import CubeShow from "../../src/components/_public/cube/cubeShow";
import { Box, Typography } from "@mui/material";
import { OrangeryNavigationContentLoader } from '../../src/components/OrangeryElements';
import CubeControl from '../../src/components/_public/cube/cubeControl';

// others
//

const CubePage: NextPage = () => {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));


  const { query } = useRouter();

  const [cubeIndex, setCubeId] = React.useState("")
  React.useEffect(() => {
    if (query.id)
      setCubeId(query.id.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id])

  const [bookingUuid, setBookingUuid] = React.useState("")
  React.useEffect(() => {
    if (query.booking)
      setBookingUuid(query.booking.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.booking])

  const [transanctionNumber, setTransanctionNumber] = React.useState("")
  React.useEffect(() => {
    if (query.tn)
      setTransanctionNumber(query.tn.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.tn])

  const [loaded, setLoaded] = React.useState(false)
  React.useEffect(() => {
    setLoaded(true)
  }, [])

  return <>{
    !loaded
      ? <OrangeryNavigationContentLoader />
      : small
        ? cubeIndex
          ? !bookingUuid
            ? <CubeShow
              cubeIndex={cubeIndex}
            />
            : <CubeControl
              cubeIndex={cubeIndex}
              bookingUuid={bookingUuid}
              transanctionNumber={transanctionNumber}
            />
          : <MessageShow message="No cube is provided." /> // "No cube id!"
        : <MessageShow message="Please open the link in your mobile device." />
  }</>;
}

function MessageShow({
  message
}: {
  message: string
}) {
  return <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography>
      {message}
    </Typography>
  </Box>
}

export default CubePage