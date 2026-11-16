// external dependencies
import {
  Typography,
  Box
} from "@mui/material";

export interface ITagOption {
  label: string;
  colors: {
    dark: string;
    light: string;
  };
}

export default function OrangeryTag({
  selectedLabel,
  options,
  minWidth,
  height,
  small,
  sx
}: {
  selectedLabel: string;
  options: ITagOption[];
  minWidth?: number;
  height?: number;
  small?: boolean;
  sx?: any;
}) {
  let selectedOption = options.find((option) => option.label === selectedLabel)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "37px",
          backgroundColor: selectedOption?.colors.light ?? "",
          color: selectedOption?.colors.dark ?? "",
          minWidth: minWidth ?? 114,
          height: height ?? 44,
          px: 1,
          flex: "none",
          ...(small ? { p: 1 } : { p: 2 })
        }}
      >
        <Typography
          sx={{
            ...(sx ? sx : { fontWeight: 600, fontSize: small ? 9 : 16, })
          }}
        >
          {selectedOption?.label}
        </Typography>
      </Box>
    </>
  );
}