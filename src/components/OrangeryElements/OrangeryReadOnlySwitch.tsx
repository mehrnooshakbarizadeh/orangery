// external dependencies
import { alpha, Box, Switch, SwitchProps, Typography } from "@mui/material";

export default function OrangeryReadOnlySwitch({
  withoutDot,
  title,
  pending,
  label,
  sx,
  checked,
  checkedLabels,
  timeSelectorMode,
  width,
  ...props
}: {
  withoutDot?: boolean;
  pending?: boolean | null;
  label?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
    pending?: React.ReactNode;
  };
  title?: React.ReactNode;
  checkedLabels?: {
    checked: React.ReactNode;
    unchecked: React.ReactNode;
  };
  timeSelectorMode?: boolean;
  width?: number
} & SwitchProps) {
  return (
    <>
      {title && (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            pb: 1,
            color: "grey.A400",
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          ...sx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // py: 0.9,
          px: 2.5,
          width: "max-content",
          minWidth: width ?? 114,
          flex: "none",
          // px: "10px",
          // width: 145,
          height: 44,
          borderRadius: '36px',
          fontSize: 16,
          fontWeight: 400,
          gap: 1.5,
          backgroundColor: pending
            ? "#fcf4e8"
            : checked
              ? timeSelectorMode
                ? "transparent"
                : "#EEFFF3"
              : timeSelectorMode
                ? "transparent"
                : "#fcf4e8",
        }}
      >
        {/* <Box
          sx={{
            width: 8,
            height: 8,
            flex: "none",
            backgroundColor: pending
              ? "#FF9900"
              : checked
                ? "#56CA29"
                : "#FF9900",
            borderRadius: "100%",
          }}
        /> */}
        <Box>
          {label && (
            <>
              <Typography fontSize={16} fontWeight={700} sx={{ color: checked ? "#42b863" : "#ff9900" }}>
                {pending
                  ? label.pending
                  : checked
                    ? label.checked
                    : label.unchecked}
                {/* {checked && label.checked}
                {!checked && label.unchecked} */}
              </Typography>
            </>
          )}
          {checkedLabels && (
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 400,
                color: checked ? "#42B863" : "#FF9900",
              }}
            >
              {checked && checkedLabels.checked}
              {!checked && checkedLabels.unchecked}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
