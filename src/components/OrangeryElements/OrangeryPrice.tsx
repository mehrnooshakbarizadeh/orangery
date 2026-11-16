// react & next
import React from "react";

// external dependencies
import NumberFormat from "react-number-format";

interface IOrangeryPriceProps {
  thousandsGroupStyle: "thousand";
  prefix: string;

  decimalSeparator: string;
  thousandSeparator: boolean | string;
  allowNegative: boolean;
  decimalScale: number;
  fixedDecimalScale: boolean;
}

export function deformatOrangeryPrice(formattedPrice: string): string {
  formattedPrice = formattedPrice.replace(OrangeryPriceProps.prefix, "");
  formattedPrice = formattedPrice.replace(
    typeof OrangeryPriceProps.thousandSeparator !== "boolean"
      ? OrangeryPriceProps.thousandSeparator
      : "",
    ""
  );
  let priceValue = formattedPrice.replace(
    OrangeryPriceProps.decimalSeparator,
    "."
  );

  return priceValue;
}

export function formatOrangeryPrice(priceValue?: string): string {
  let formattedPrice = priceValue ? priceValue?.toString() : "0";

  formattedPrice.replace(".", OrangeryPriceProps.decimalSeparator);

  return formattedPrice;
}

export const OrangeryPriceProps: IOrangeryPriceProps = {
  thousandsGroupStyle: "thousand",
  prefix: "€",

  decimalSeparator: ",",
  // thousandSeparator: false,
  thousandSeparator: ".", // works
  allowNegative: true,
  decimalScale: 2,
  fixedDecimalScale: true,
};

export default function OrangeryPrice({
  euro,
  germanFormat = true,
  // setFormattedValue,
}: {
  euro?: number | string;
  germanFormat?: boolean;
  // setFormattedValue?: (value: string) => string
}) {
  if (!euro) euro = 0;

  const [formattedValue, setFormattedValue] = React.useState("");

  function getFormattedValue() {
    return formattedValue
  }

  // @ts-ignore
  return (
    <NumberFormat
      {...OrangeryPriceProps}
      suffix={germanFormat ? " €" : ""}
      prefix={germanFormat ? "" : "€"}
      value={euro}
      displayType="text"
      type="text"
      onValueChange={(values) => {
        const { formattedValue, value, floatValue } = values;
        setFormattedValue(formattedValue)
      }}
    />
  );
}