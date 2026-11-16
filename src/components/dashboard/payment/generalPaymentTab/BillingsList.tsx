import {
  OrangeryReadOnlySwitch,
  OrangeryPrice,
  OrangeryCircleLoading,
} from "../../../OrangeryElements";
import { IBilling, useBillings } from "../../../../queries/billing";
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useSortBy,
  useTable,
} from "react-table";
import React from "react";
import { Box, Grid } from "@mui/material";

// others
const columns: Column<IBilling>[] = [
  {
    Header: "Name",
    accessor: "name",
    minWidth: 80,
    width: "25%",
  },
  {
    Header: "Price",
    accessor: "price",
    minWidth: 80,
    width: "15%",
  },
  {
    Header: "No. of Employees",
    accessor: "number_of_employees",
    minWidth: 80,
    width: "15%",
  },
  {
    Header: "Date",
    accessor: "date",
    minWidth: 80,
    width: "15%",
  },
  {
    Header: "Plan",
    accessor: "plan",
    minWidth: 80,
    width: "15%",
  },
  {
    Header: "Status",
    accessor: "charge_success",
    minWidth: 80,
    width: "15%",
  },
  // {
  //   Header: "Actions",
  //   minWidth: 80,
  //   width: "15%",
  // },
];

export default function BillingsList() {
  // const globalState = useGlobalState();
  const { data, isLoading } = useBillings();

  return (
    <>
      {isLoading ? (
        <OrangeryCircleLoading />
      ) : data && Array.isArray(data) && data.length > 0 ? (
        <Table data={data} />
      ) : (
        "No billing history is available."
      )}
    </>
  );
}

function Table({ data }: { data: IBilling[] }) {
  const [desc, setDesc] = React.useState(false);
  const [header, setHeader] = React.useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // setGlobalFilter,
    // state: { groupBy, expanded, globalFilter },
  } = useTable<IBilling>(
    {
      columns,
      data: data || [],
      // filters: [{id: "name", value: "name" }],
      // initialState: {
      //   groupBy: ["name"],
      //   sortBy: [
      //     { id: "name", desc },
      //     { id: "uuid", desc },
      //   ],
      // },
    },
    useFilters,
    useGroupBy,
    useGlobalFilter,
    useSortBy
    // useControlledState
  );

  const handleSort = () => {
    setDesc(!desc);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        // height: "100%",
        // minHeight: 666,
        borderRadius: 1.5,
        // py: 3,
        // px: 2,
        width: "100%",
      }}
    >
      {/* <Box
        sx={{
          // display: "flex",
          justifyContent: "end",
          alignItems: "center",
          pt: 1,
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            flexGrow: 1,
            gap: 1,
          }}
        >
          <Box>
            <OrangeryGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
              py: 1.3,
              px: 1,
              borderRadius: 1,
              flexShrink: 0,
              "& .sort-icon": { width: "1.3rem", color: "grey.A400" },
              "& .sort-button": { minWidth: 46 },
            }}
          >
            <Button onClick={handleSort} className="sort-button">
              {desc ? (
                <ArrowDownAZIcon className="sort-icon" />
              ) : (
                <ArrowUpZAIcon className="sort-icon" />
              )}
            </Button>
          </Box>
        </Box>
      </Box> */}
      <Grid container {...getTableProps()} sx={{ flexDirection: "column" }}>
        {headerGroups.map((headerGroup) => (
          <>
            <Box
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                py: 3,
                px: 4,
                mr: "10px",
                mb: "10px",
                backgroundColor: "grey.200",
                borderRadius: 1.5,
                fontSize: 15,
                fontWeight: 700,
                color: "grey.A700",
                width: "100%",
              }}
            >
              {headerGroup.headers.map((column) => (
                <>
                  <Box
                    {...column.getHeaderProps()}
                    key={column.id}
                    sx={{
                      "& .sort-icon": { width: "1.3rem" },
                      "& .sort-button": { minWidth: 36 },
                      "&:first-of-type": {
                        justifyContent: "start",
                        flexGrow: 1,
                      },
                      "&:last-child": { justifyContent: "center" },
                      "&:nth-last-child(2)": {
                        justifyContent: "center",
                        // flexGrow: 1,
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // textAlign: "center",
                      width: column.width,
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.render("Header")}
                  </Box>
                </>
              ))}
            </Box>
          </>
        ))}
        <Box
          sx={{
            overflowY: "auto",
            // height: "calc(100vh - 200px)",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {},
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          {rows.map((row) => {
            prepareRow(row);
            return <RowR key={row.id} row={row} />;
          })}
        </Box>
      </Grid>
    </Box>
  );
}

function RowR({ row }: { row: Row<IBilling> }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          py: 2.7,
          pl: 4,
          pr: "1.8rem",
          boxShadow: "1px 1px 8px #0000000a",
          border: "1px solid rgb(210 215 221)",
          alignItems: "center",
          borderRadius: 1.5,
          mb: 1.2,
          ml: 0,
          mr: "5px",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            textAlign: "start",
            whiteSpace: "pre-line",
            width: "20%",
          }}
        >
          {row.original.name}
        </Box>

        <Box
          sx={{
            textAlign: "center",
            width: "15%",
            whiteSpace: "pre-line",
          }}
        >
          <OrangeryPrice euro={row.original.price} germanFormat />
        </Box>

        <Box
          sx={{
            textAlign: "center",
            width: "15%",
            whiteSpace: "pre-line",
          }}
        >
          {row.original.number_of_employees}
        </Box>

        <Box
          sx={{
            textAlign: "center",
            width: "15%",
          }}
        >
          {new Date(row.original.date).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          })}
        </Box>

        <Box
          sx={{
            textAlign: "center",
            width: "15%",
          }}
        >
          {row.original.plan}
        </Box>

        <Box
          sx={{
            textAlign: "center",
            width: "15%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <OrangeryReadOnlySwitch
            label={{ checked: "Success", unchecked: "Failed" }}
            checked={row.original.charge_success}
          />
        </Box>
        {/* <Box
          sx={{
            textAlign: "center",
            width: "15%",
          }}
        >
          <></>
        </Box> */}
      </Box>
    </>
  );
}
