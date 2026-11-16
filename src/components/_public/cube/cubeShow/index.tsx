// 
//

// react & next
import { useRouter } from "next/router";
import React from "react";

// external dependencies
import { Box, Button, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryCarousel, OrangeryNavigationContentLoader, OrangeryNavigationPlaceholder, OrangeryPrice } from "../../../../components/OrangeryElements";
import CubeDateTimeForm from "./CubeDateTimeForm";

// queries & backend
import { IFeature, ICube, useCube } from "../../../../queries/_public/cube";

// icons, images & colors
import PlaceholderSvg from "../../../../assets/svg/placeholders/default.svg";
import LocationIcon from "../../../../assets/svg/location-dot-white.svg";
import Container from "../container";

export default function CubeShow({
  cubeIndex
}: {
  cubeIndex: string
}) {
  const {
    data: cube,
    isLoading
  } = useCube(cubeIndex);

  const [step, setStep] = React.useState<number>(0);

  const router = useRouter();
  function handleNext() {
    setStep(step + 1);
  }

  return (
    <>
      {isLoading
        ? <OrangeryNavigationContentLoader />
        : cube
          ? step === 0
            ? <CubeCard cube={cube} onSubmit={handleNext} />
            : <CubeDateTimeForm cube={cube} />
          : <OrangeryNavigationPlaceholder
            vertical
            width={213}
            height={224}
            title={"No cube found!"}
            subtitle={""}
            PlaceholderSvg={PlaceholderSvg}
            AddNewButton={<></>}
            addNewButtonText={""}
          />
      }
    </>
  );
}

function CubeCard({
  cube,
  onSubmit
}: {
  cube: ICube;
  onSubmit: () => void;
}) {
  return <Container>
    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 700,
        wordBreak: "break-word"
      }}
    >
      {cube.name}
    </Typography>

    <OrangeryCarousel
      // images={cube.imagesUrls.map((imagesUrl) => imagesUrl.id)}
      imageUrls={cube.imagesUrls.map((imageUrl) => imageUrl.url)}
      width="100%"
      height={200}
    />

    <OrangeryAddress address={cube.address} />

    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 400,
        color: "#55585C"
      }}
    >
      {cube.description}
    </Typography>

    <FeatureRows features={cube.features} />

    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        mt: "auto",
        pb: 4
      }}
    >
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        <OrangeryPrice euro={cube.pricing.price} /> / Hour
      </Typography>

      <Button
        variant="contained"
        onClick={onSubmit}
        // color= "primary"
        sx={{
          fontSize: 19,
          fontWeight: 700,
          height: 61,
          width: 173,
          borderRadius: 999,
          "&:disabled": {
            backgroundColor: "grey",
          },
        }}
      >
        Next
      </Button>
    </Box>
  </Container>
}

function FeatureRows({
  features
}: {
  features: IFeature[]
}) {
  return <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2
    }}
  >
    {features?.map(feature => (
      <FeatureCard
        key={feature.name}
        feature={feature}
      />
    ))}
  </Box>
}

function FeatureCard({
  feature
}: {
  feature: IFeature
}) {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return <Table
    sx={{
      width: "100%",
      'td, th': {
        border: 0,
        px: .75,
        py: 0
      }
    }}
    size="small"
  >
    <TableBody>
      <TableRow>
        <TableCell align="center" sx={{
          width: 44
        }}>
          <FeatureAvatar iconUrl={feature.iconUrl} /> {/* iconName={slugify(feature.title)}  */}
        </TableCell>
        <TableCell align="left">
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#55585C"
            }}
          >
            {feature.name}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell align="center"></TableCell>
        <TableCell align="left">
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 400,
              color: "#55585C"
            }}
          >
            {feature.description}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
}

function FeatureAvatar({
  iconName,
  iconUrl,
}: {
  iconName?: string;
  iconUrl?: string;
}) {
  return <Box
    sx={{
      display: "flex",
      flexDiraction: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#EDEEF0",
      width: 32,
      height: 32,
      color: "#55585C",
      borderRadius: 9999,
    }}
  >
    <Box
      sx={{
        objectFit: "cover",
        width: 14,
        maxHeight: 18,
      }}
      component={"img"}
      src={iconUrl ?? `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/features/${iconName}.svg`}
      loading="lazy"
    />
  </Box>
}

export function OrangeryAddress({
  address
}: {
  address: string
}) {
  return <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: .75,
      "& .icon": {
        height: 16
      }
    }}
  >
    <LocationIcon className="icon" />
    <Typography
      sx={{
        fontSize: 18,
        fontWeight: 800,
        wordBreak: "break-word"
      }}
    >
      {address}
    </Typography>
  </Box>

}