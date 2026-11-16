// external dependencies
import { Box } from "@mui/material";

export default function EmployeeView({
  employee,
}: {
  employee?: {
    name: string;
    uuid: string;
  };
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            border: (theme) => `2px solid ${theme.palette.secondary.main}`,
            borderRadius: "100%",
            p: 0.5,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundColor: (theme) => theme.palette.secondary.light,
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "grey.A200",
              fontWeight: 600,
            }}
          >
            {employee?.name.slice(0, 2).toLocaleUpperCase()}
          </Box>
        </Box>
        {employee ? <Box>{employee.name}</Box> : "Not Assigned user"}
      </Box>
    </>
  );
}
