import { Box, Icon, Typography } from "@mui/material";
import OrangeryTextFieldStr from "../../../OrangeryElements/OrangeryTextFieldStr";
import LayerIcon from "../../../../assets/svg/layer.svg";

export function QuickItemStr({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleValue = (value: string) => {
    onChange(value);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "6.5px",
          p: 1,
          pb: 0,
          "& .icon": { width: "1.1rem", height: "1.1rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alinItems: "center",
            gap: 3.5,
            p: "10px",
            backgroundColor: "#F9F9FA",
            borderRadius: "6.5",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              pl: "15px",
            }}
          >
            <Icon sx={{ display: "flex", alignItems: "center" }}>
              <LayerIcon className="icon" />
            </Icon>
            <Typography>Floor</Typography>
          </Box>
          <OrangeryTextFieldStr
            variant="standard"
            type="name"
            // label="Floor name"
            name="name"
            // startIcon={<EmailIcon />}
            placeholder="Enter the floor’s name"
            // error={!!state.name.error}
            value={value}
            // helperText={state.name.error}
            // startIcon={<ParkingIcon />}
            onChange={(e) => handleValue(e.target.value)}
          />
        </Box>
      </Box>
    </>
  );
}
