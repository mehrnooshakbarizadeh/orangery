// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import Can from "../../../../services/can";

// react & next
import React, { useEffect } from "react";
import { useRouter } from "next/router";

// external dependencies
import { Box, Typography } from "@mui/material";
// import CircularProgress from "@mui/material/CircularProgress";

// orangery elements & internal dependencies
import AddNewOfficeButton from "./AddNewOfficeButton";
import AddNewOfficeDialog from "./AddNewOfficeDialog";

// queries & backend
import { IOffice, IOfficeResult, useOffices } from "../../../../queries/office";

// icons, images & colors
import LocationIcon from "../../../../assets/svg/location-dot-white.svg";
import AngleDownIcon from "../../../../assets/svg/angle-down-narrow.svg";
import AngleUpIcon from "../../../../assets/svg/angle-up-narrow.svg";

export default function OfficeSelect() {
  const router = useRouter();
  // const { data: offices, isLoading, isError } = useOffices();
  const { offices, currentOffice, set_office_uuid, setCurrentOffice } = useGlobalState();

  // const [currentOffice, setCurrentOffice] = React.useState({
  //   name: "",
  //   address: "",
  //   employee_estimate: 0,
  // });
  // useEffect(() => {
  //   if (offices && offices.length > 0) {
  //     if (globalState.office_uuid) {
  //       if (
  //         offices.filter((office) => office.uuid === globalState.office_uuid)
  //           .length > 0
  //       )
  //         setCurrentOffice(
  //           offices.filter(
  //             (office) => office.uuid === globalState.office_uuid
  //           )[0]
  //         );
  //       else {
  //         // globalState.set_office_uuid(offices[0].uuid);
  //       }
  //     } else {
  //       // globalState.set_office_uuid(offices[0].uuid);
  //     }
  //   }
  //
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [offices, globalState.office_uuid]);

  function onOfficeChange(office: IOfficeResult) {
    if (office) {
      // setCurrentOffice(office);
      set_office_uuid(office.uuid);
      setCurrentOffice(office);

      localStorage.setItem("current_office_name", office.name);
      localStorage.setItem("current_office_uuid", office.uuid);
      localStorage.setItem("current_office_address", office.address);
    } else {
      localStorage.setItem("current_office_name", "");
      localStorage.setItem("current_office_uuid", "");
      localStorage.setItem("current_office_address", "");
    }
  }

  const [open, setOpen] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleAddNewOfficeButtonClick() {
    setDialogOpen(true);
  }

  return (
    <>
      {offices && offices.length > 0 ? (
        <>
          <Box sx={{ float: "right" }}>
            <Box
              sx={{
                height: open ? "" : "49px",
                minWidth: "max-content",
                borderRadius: open ? "15px" : "43px",
                backgroundColor: open ? "#FFFFFF" : "#F7F8FA",
                float: "right",
                // padding: "8px",
                pt: "10px",
                transition: "0.2s",
                marginTop: "10px",
                boxShadow: open ? "0px 4px 50px rgba(0, 0, 0, 0.15)" : "",
                ":hover": {
                  cursor: "pointer",
                  mr: "-0px",
                },
              }}
              onClick={() => setOpen(!open)}
              onMouseLeave={() => setOpen(false)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  className={"noselect"}
                  sx={{
                    // float: "left",
                    pl: 2,
                    pt: "2px",
                    color: "#2f2f2f",
                    width: "32px",
                  }}
                >
                  <LocationIcon />
                </Box>
                <Box sx={{}}>
                  <Typography
                    variant={"officeSelect"}
                    className={"noselect"}
                    sx={{
                      ml: "20px",
                      mr: "70px",
                    }}
                  >
                    {currentOffice?.name}
                  </Typography>
                </Box>
              </Box>
              {/* <Box>
                <Typography
                  variant={"officeSelect"}
                  className={"noselect"}
                  sx={{
                    ml: "20px",
                    mr: "70px",
                  }}
                >
                  {currentOffice?.address}
                </Typography>
              </Box> */}
              <Box
                sx={{
                  mt: "-28px",
                  mr: "25px",
                  float: "right",
                  width: "18px",
                  height: "50px",
                }}
              >
                {open ? (
                  <AngleUpIcon style={{ width: 20 }} />
                ) : (
                  <AngleDownIcon style={{ width: 20 }} />
                )}
              </Box>
              <Box height={"10px"} />

              <Box
                sx={{
                  visibility: open ? "visible" : "hidden",
                  transition: open ? "0.5s" : "0.2s",
                  opacity: open ? 1 : 0,
                }}
              >
                <OfficesList
                  oneOffice={offices.length > 1}
                  offices={offices}
                  AddNewButton={
                    <Can I="view" a="AddNewLocationButton">
                      <AddNewOfficeButton onClick={handleAddNewOfficeButtonClick} />
                    </Can>
                  }
                />
              </Box>
            </Box>
          </Box>

          <AddNewOfficeDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            onOfficeChange={onOfficeChange}
          />
        </>
      ) : (
        <>No office is available</>
      )}
    </>
  );

  function OfficesList({
    offices,
    AddNewButton,
    oneOffice,
  }: {
    offices: IOffice[];
    AddNewButton?: JSX.Element;
    oneOffice?: boolean;
  }) {
    const { currentOffice } = useGlobalState();

    return (
      <>
        <Box
          sx={{
            width: "calc(100% - 4px)",
            maxHeight: "260px",
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              // boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              // webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              // outline: "1px solid slategrey",
              borderRadius: 5,
            },
          }}
        >
          {oneOffice ? (
            offices.map((office) => (
              <Box
                key={office.uuid}
                sx={{
                  zIndex: 2,
                  minHeight: "50px",
                  borderRadius: "5px",
                  pl: "30px",
                  pt: "12px",
                  ...(currentOffice?.uuid === office.uuid ? { backgroundColor: "#f3f3f3" } : {}),
                  // p: "10px",
                  ":hover": {
                    cursor: "pointer",
                    backgroundColor: "#f3f3f3",
                  },
                }}
                onClick={(e) => {
                  if (e) e.preventDefault();
                  onOfficeChange(office);
                }}
              >
                <Typography
                  className={"noselect"}
                  sx={{
                    fontSize: "16px",
                    ml: "20px",
                    fontWeight: 400,
                    mr: "70px",
                  }}
                >
                  {office.name}
                </Typography>
              </Box>
            ))
          ) : (
            <></>
          )}
        </Box>

        {AddNewButton}
      </>
    );
  }

  // const [dialog, setDialog] = React.useState(false);

  // const [current_office_name, set_current_office_name] = React.useState("");
  // const [current_office_uuid, set_current_office_uuid] = React.useState("");
  // const [current_office_address, set_current_office_address] = React.useState("");

  // useEffect(() => {
  //   set_current_office_uuid(localStorage.getItem("current_office_uuid")!)
  //   globalState.set_office_uuid(localStorage.getItem("current_office_uuid")!);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const [newLocationName, setNewLocationName] = React.useState("");
  // const [newLocationAddress, setNewLocationAddress] = React.useState("");
  // const [newLocationCompanySize, setNewLocationCompanySize] = React.useState(1);

  // const [hitButton, setHitButton] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);

  // function finishCreation() {
  //   setDialog(false);
  //   setLoading(false);
  //   setNewLocationName("");
  //   setNewLocationAddress("");
  //   setNewLocationCompanySize(1);
  //   loadCompanies();
  //   OrangeryToast("Successfully created new a Location", "success");
  // }

  // function createNewLocation() {
  //   if (!loading) {
  //     setLoading(true);
  //     useInsertOffice({
  //       name: newLocationName,
  //       address: newLocationAddress,
  //       employee_estimate: newLocationCompanySize
  //     }
  //     ).then((res) => {
  //       if (res.success) {
  //         setTimeout(finishCreation, 700);
  //       }
  //     });
  //   }
  // }

  // function renderCreateOfficeDialog() {
  //   if (true) {
  //     return (
  //       <Box
  //         sx={{
  //           visibility: dialog ? "visible" : "hidden",
  //           opacity: dialog ? 1 : 0,
  //           transition: "0.2s",
  //           zIndex: "2",
  //           position: "fixed",
  //           height: "6000px",
  //           width: "6000px",
  //           ml: "-3000px",
  //           backgroundColor: "#000000d4",
  //         }}
  //       >
  //       </Box>
  //     );
  //   }
  // }
  // // @ts-ignore
  // return (
  // );
}
