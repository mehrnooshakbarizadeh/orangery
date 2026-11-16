// contexts & globals
import { useGlobalState } from "../../../Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// react & next
import React, { useState } from "react";

// external dependencies
import { Box, Typography, Grid, Divider, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
import * as XLSX from "xlsx";

// orangery elements & internal dependencies
import { FieldError, FormError, ValueState } from "../../../states/mobx-form";
import { OrangeryNavigationContentLoader } from "../../OrangeryElements";

// queries & backend
import { useAllReports } from "../../../queries/reports";

// icons, images & colors
// import DownloadIcon from "../../../assets/svg/download.svg";
import DownloadIcon from "../../../assets/svg/download.svg";

export default function AllLocationsReportsTable() {
  const globalState = useGlobalState();
  const {
    data: reports,
    isLoading,
    isError
  } = useAllReports(globalState.office_uuid);

  const rows: { name?: string; months?: number[] }[] = [];

  for (let i = 0; i < reports?.titles.length!; i++) {
    rows.push(
      createData(
        reports?.titles[i],
        reports?.items.map((item) => item.columns[i])
      )
    );
  }

  let excelData: any = [];
  for (let i = 0; i < reports?.titles.length!; i++) {
    let tempData: any = {};
    tempData.items = reports?.titles[i];
    let headers = reports?.items.map((item) => item.date);
    headers?.forEach((header, idx) => {
      tempData[header] = reports?.items[idx].columns[i];
    });
    excelData.push(tempData);
  }

  return (<>
    {isLoading
      ? <OrangeryNavigationContentLoader />
      : <Box
        sx={{
          overflowY: "hidden",
          maxWidth: "100%",
          overflowX: "hidden",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          // boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
          px: { xs: 0, sm: 2, md: 4 },
          pt: { xs: 0, sm: 2, md: 4 },
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            overflowY: "hidden",
            maxWidth: "100%",
            overflowX: "hidden",
            height: "calc(100% - 64px)",  ////////!!!!!!!! should revised
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              marginLeft: "20px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 5,
            },
          }}
        >
          <Typography
            color="black"
            fontSize={28}
            fontWeight={700}
            sx={{ flexGrow: 1, mb: 4 }}
          >
            All Locations Reports
          </Typography>
          <Box
            sx={{
              mb: 1,
              // mx: "auto",
              // my: "auto",
              width: { xs: "100%", sm: "100%", md: "100%" },
              maxWidth: "1600px",
              "& > * + *": {
                mb: 3,
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => downloadExcel(excelData)}
                sx={{
                  color: "#074EE8",
                  textDecoration: "none",
                  display: "flex",
                  alignitems: "center",
                  gap: 1,
                  "& .upload-icon": {
                    width: "1.3rem",
                    height: "1.3rem",
                    color: "#1e60e9",
                  },
                }}
              >
                <DownloadIcon className="upload-icon" />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Download as Excel .xlsx file
                </Typography>
              </Button>
            </Box>
            <Observer>
              {() => (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center", overflowX: "hidden" }}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        width: 1700,
                        "&::-webkit-scrollbar": {
                          height: "0.4em",
                        },
                        "&::-webkit-scrollbar-track": {
                          marginLeft: "20px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0,0,0,.1)",
                          borderRadius: 5,
                        },
                      }}>
                      <Table
                        stickyHeader={true}
                        sx={{
                          // minWidth: 850,
                          tableLayout: "fixed",
                          // "& .MuiTableInput-root": {
                          width: "max-content",
                          // },
                        }}
                        aria-label="Reports test"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              {new Date(
                                reports?.items[0].date || ""
                              ).toLocaleString("en-US", {
                                month: "long",
                              })}
                            </TableCell>
                            {reports?.items.map((item) => (
                              <TableCell key={item.date} align="center">
                                {/* {toStringDay(item.date)} */}
                                {item.date}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow
                              key={row.name}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.name}
                              </TableCell>
                              {row.months?.map((num) => (
                                <TableCell
                                  key={row.name}
                                  align="center"
                                  height={"10"}
                                >
                                  {num}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
            </Observer>
            <Box sx={{ textAlign: "right" }}></Box>
          </Box>
        </Box>
      </Box>
    }
  </>
  );
}

function createData(name?: string, months?: number[]) {
  return {
    name,
    months,
  };
}

const downloadExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "all-locations-reports.xlsx");
};
