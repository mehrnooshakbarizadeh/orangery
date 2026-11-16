// 
//

// react & next
import React, { useEffect, useState } from "react";
import NextLink from "next/link";

// external dependencies
import {
  Box,
  Button,
  Typography,
  Link as MUILink
} from "@mui/material";

// orangery elements & internal dependencies
import {
  OrangeryCarousel,
  OrangeryNavigationContentLoader,
  OrangeryNavigationPlaceholder,
  OrangerySwitch
} from "../../../../components/OrangeryElements";

// queries & backend
import {
  ICube,
  useControlCube,
  useWidgetCategories,
  ICubeWidgetCategory,
  ICubeWidget,
  useCubeBooking
} from "../../../../queries/_public/cube";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import useMobileDetect from "../../../../hooks/useMobileDetect";
import Container from "../container";
import SuccessSvg from "../../../../assets/svg/_public/cube/success.svg"
import { OrangeryCountDown } from "../../../OrangeryElements";
import useInterval from "../../../../hooks/useInterval";
import { useQueryClient } from "react-query";

export default function CubeControl({
  cubeIndex,
  bookingUuid,
  transanctionNumber
}: {
  cubeIndex: string;
  bookingUuid: string;
  transanctionNumber: string;
}) {
  const {
    data: cubeBooking,
    isLoading
  } = useCubeBooking(bookingUuid);

  return (
    <>
      {isLoading
        ? <OrangeryNavigationContentLoader />
        : cubeBooking
          ? <CubeControlCard
            cube={cubeBooking.cube_info}
            bookingUuid={bookingUuid}
            transanctionNumber={transanctionNumber}
            secondsToStart={cubeBooking.seconds_to_start}
          />
          : <OrangeryNavigationPlaceholder
            vertical
            width={213}
            height={224}
            title={"Data are invalid!"}
            subtitle={""}
            PlaceholderSvg={PlaceholderSvg}
            AddNewButton={<></>}
            addNewButtonText={""}
          />
      }
    </>
  );
}

function CubeControlCard({
  cube,
  bookingUuid,
  transanctionNumber,
  secondsToStart,
}: {
  cube: ICube;
  bookingUuid: string;
  transanctionNumber: string;
  secondsToStart: number;
}) {
  const device = useMobileDetect();

  // console.log(`isDesktop: ${device.isDesktop()}`);
  // console.log(`isMobile: ${device.isMobile()}`);
  // console.log(`isAndroid: ${device.isAndroid()}`);
  // console.log(`isIos: ${device.isIos()}`);
  // console.log(`isWindows: ${device.isWindows()}`);
  // background: #074EE812;

  const appUrl = device.isIos()
    ? "https://apps.apple.com/tr/app/orangeryos/id1615709484"
    : device.isAndroid()
      ? "https://play.google.com/store/apps/details?id=com.orangeryos"
      : ""

  const {
    data: initialCubeWidgetsCategories,
    isLoading: cubeWidgetsCategoriesIsLoading
  } = useWidgetCategories(bookingUuid);

  const [cubeWidgetsCategories, setCubeWidgetsCategories] = useState<ICubeWidgetCategory[] | undefined>(undefined);

  useEffect(() => {
    if (initialCubeWidgetsCategories) {
      if (localStorage.getItem("cubeFirstView-" + bookingUuid) !== "false")
        setTimeout(() => setCubeWidgetsCategories(initialCubeWidgetsCategories), 5000)
      else
        setCubeWidgetsCategories(initialCubeWidgetsCategories)

      setIsRunning(false)
      localStorage.setItem("cubeFirstView-" + bookingUuid, "false");
      setCubeFirstView(false)
    }
  }, [initialCubeWidgetsCategories, bookingUuid])

  const queryClient = useQueryClient();
  async function updateWidgetCategoriesMutation() {
    queryClient.invalidateQueries(["cubeWidgetCategories"]);
  }

  const [pollingDelay, setPollingDelay] = React.useState(5 * 1000);
  const [isRunning, setIsRunning] = React.useState(true);
  useInterval(() => {
    updateWidgetCategoriesMutation()
  }, isRunning ? pollingDelay : null);

  const [cubeFirstView, setCubeFirstView] = useState(false);
  useEffect(() => {
    if (bookingUuid)
      setCubeFirstView(localStorage.getItem("cubeFirstView-" + bookingUuid) !== "false")
  }, [bookingUuid])

  const [seconds, setSeconds] = useState(secondsToStart);
  function onTimerComplete() {
    // TODOS
    updateWidgetCategoriesMutation()
  }

  return <Container
    sx={{
      gap: 1.5,
    }}
  >
    {appUrl &&
      <Box
        sx={{
          backgroundColor: "#074EE812",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 4,
          py: 1,
          px: 2
        }}
      >
        <Typography
          sx={{
            color: "#074EE8",
            fontSize: 16,
            fontWeight: 700
          }}
        >
          Use our orangery app for a better experience
        </Typography>
        <NextLink href={appUrl} passHref>
          <MUILink
            sx={{
              backgroundColor: "white",
              textDecoration: "none",
              color: "#074EE8",
              fontSize: 16,
              fontWeight: 700,
              py: .5,
              px: 1.5,
              borderRadius: 3
            }}
          >
            Install
          </MUILink>
        </NextLink>
      </Box>
    }

    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 700,
        wordBreak: "break-word",
        mt: 2
      }}
    >
      {cube.name}
    </Typography>

    <OrangeryCarousel
      imageUrls={cube.imagesUrls.map((imagesUrl) => imagesUrl.url)}
      width="100%"
      height={120}
    />

    <Box>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: "#2B2E33",
          textAlign: "center"
        }}
      >
        Control Cube
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
          color: "#55585C",
          textAlign: "center"
        }}
      >
        Use the smart controls below to make your stay comfortable. You can open the door and control other features below.
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
          color: "#55585C",
          textAlign: "center"
        }}
      >
        you can open the cube door and for other cube controls, please use OrangeryOS app.
      </Typography>
    </Box>

    {cubeWidgetsCategories && cubeWidgetsCategories.length > 0
      ? <ControlWidgets
        cubeIndex={cube.index}
        bookingUuid={bookingUuid}
        cubeWidgetsCategories={cubeWidgetsCategories}
      />
      : !cubeFirstView
        ? <OrangeryNavigationContentLoader />
        : <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 6,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              mx: "auto",
              py: 1,
              "& .icon": {
                height: 53,
                width: 53
              }
            }}
          >
            <SuccessSvg className="icon" />
          </Box>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
              color: "#09BC86",
              mx: "auto",
              textAlign: "center"
            }}
          >
            Payment Successful!
          </Typography>
          {transanctionNumber && transanctionNumber !== "" &&
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#55585C",
                mx: "auto",
                mt: 1
              }}
            >
              {`Transaction Number: ${transanctionNumber}`}
            </Typography>
          }

          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 400,
              mx: "auto",
              mt: 4
            }}
          >
            {`Time to controls get ready`}
          </Typography>
          <OrangeryCountDown seconds={seconds} callBack={onTimerComplete} />
        </Box>
    }
  </Container>
}

function ControlWidgets({
  cubeIndex,
  bookingUuid,
  cubeWidgetsCategories,
}: {
  cubeIndex: number;
  bookingUuid: string
  cubeWidgetsCategories: ICubeWidgetCategory[],
}) {
  return <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      flexGrow: 1,
      mt: 3
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "space-between",
        mx: "auto",
        width: "100%",
        gap: 2,
        maxWidth: 500
      }}
    >
      {cubeWidgetsCategories.map((category) => {
        let active = category.widgets.filter((widget) => widget.value).length > 0;
        return <Box
          key={category.title}
          sx={{
            border: active ? "1px solid #F9F9FA" : "1px solid #A5AAB4",
            boxShadow: "0px 16px 80px rgba(0, 0, 0, 0.03), 0px 9.4208px 41.728px rgba(0, 0, 0, 0.03616), 0px 1.9456px 8.576px rgba(0, 0, 0, 0.02192), 0px 0.4352px 3.712px rgba(0, 0, 0, 0.01384)",
            backgroundColor: active ? "#FFFFFF" : "#C9CCD2",
            borderRadius: 2.5,
            p: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5
          }}
        >
          <Typography
            sx={{
              color: "#2B2E33",
              fontSize: 20,
              fontWeight: 700
            }}
          >
            {category.title}
          </Typography>

          {category.widgets.map((widget) => (
            <ControlWidget
              cubeIndex={cubeIndex}
              bookingUuid={bookingUuid}
              widget={widget}
              key={widget.title}
            />
          ))}
        </Box>
      })}
    </Box>
  </Box>
}

function ControlWidget({
  cubeIndex,
  bookingUuid,
  widget
}: {
  cubeIndex: number;
  bookingUuid: string;
  widget: ICubeWidget
}) {
  const [value, setValue] = React.useState<boolean>(widget.value)
  const [error, setError] = React.useState<boolean>(false)

  useEffect(() => {
    setValue(widget.value)
  }, [widget.value])

  const [waiting, setWaiting] = useState(false);
  const mutation = useControlCube();
  async function handleCubeControl(sensorType: string, v: number) {
    setWaiting(true);
    try {
      setValue(v === 1);
      let result = await mutation.mutateAsync({
        cubeIndex: cubeIndex,
        booking_uuid: bookingUuid,
        sensor_type: sensorType,
        value: v
      });
      if (!result.success)
        setValue(v === 0);
      setWaiting(false);
    } catch (err: any) {
      setValue(v === 0);
      setError(true);
      setWaiting(false);
    }
  }

  return <Box
    sx={{
      display: "flex",
      felxDirection: "row",
      justifyContent: "space-between"
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1
      }}
    >
      <Box
        sx={{
          objectFit: "cover",
          width: 36,
          // maxHeight: 18,
        }}
        component={"img"}
        src={`https://d3krgrpilxvb8v.cloudfront.net${widget.value ? widget.metadata.iconOn : widget.metadata.iconOff}`}
        loading="lazy"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "#2B2E33"
          }}
        >
          {widget.title}
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "#A5AAB4"
          }}
        >
          {widget.value ? widget.metadata.statusOn : widget.metadata.statusOff}
        </Typography>
      </Box>
    </Box>
    <OrangerySwitch
      // label={{
      //   checked: "",
      //   unchecked: "",
      // }}
      backgroundColor={"transparent"}
      variant="large"
      checked={value}
      disabled={waiting}
      onChange={(e) => {
        if (!waiting)
          handleCubeControl(widget.id, e.target.checked ? 1 : 0);
      }}
    />
  </Box>
}