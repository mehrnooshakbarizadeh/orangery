// react & next
import React from "react";

// external dependencies
import {
  Box,
} from "@mui/material";
import { BadgeDelta, DeltaType, LineChart } from "@tremor/react";

// orangery elements & internal dependencies
//

// queries & backend
//

// icons, images & colors
//

export default function OrangeryLineChart({
  data,
  label,
  unit,
}: {
  data: any[];
  label?: string;
  unit?: string;
}) {
  const dataFormatter = (value: string | number, unit?: string) => {
    // const ref = React.createRef();
    // let thisValue = <OrangeryPrice setGetFormattedValue={setGetFormattedValue} euro={value} germanFormat />

    return unit === "€" &&
      (typeof value === "string" || typeof value === "number")
      ? // ? <OrangeryPrice euro={value} germanFormat />
      `${value}${unit ? ` ${unit}` : ""}`
      : `${value}${unit ? ` ${unit}` : ""}`;
  };

  return <Box
    sx={{
      zoom: {
        xs: 1.25,
        xl: 1.11,
      },
    }}
  >
    <LineChart
      data={data}
      dataKey={"date"}
      categories={[label ?? "value"]}
      colors={["yellow"]}
      // autoMinValue={false}
      valueFormatter={(number: number) =>
        dataFormatter(number, unit)
      }
      // marginTop="mt-6"
      // yAxisWidth="w-12"
      height={"h-80"}
    />
  </Box>
}