// contexts & globals
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// react & next
import React from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

// external dependencies
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  Chip,
  Autocomplete,
  Avatar,
  Icon,
} from "@mui/material";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react-lite";
// import NotificationEmailForm from "./NotificationEmailForm";
// import OfferTemplateForm from "./OfferTemplateForm";

// orangery elements & internal dependencies
import {
  FieldError,
  FormError,
  ValueState,
  ArrayValueState,
} from "../../../../states/mobx-form";
import {
  OrangeryToast,
  OrangeryTextField,
  OrangeryTextAreaField,
  OrangeryEmployeesAutocomplete,
  OrangeryUserCircle,
  OrangeryEmployeesAvatarAutocomplete,
  OrangeryAttachmentsButton,
  OrangeryImagesField,
} from "../../../OrangeryElements";

// queries & backend
import { IEmployee, useEmployees } from "../../../../queries/employee";
import {
  IOfficeGuideline,
  IOptionalInformation,
  useOfficeGuideline,
  IAmenities,
  useAmenities,
  useUpdateOfficeGuideline,
  IOptionalInformationUpdateParams,
} from "../../../../queries/officeGuideline";

// icons, images & colors
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditPenIcon from "../../../../assets/svg/editPen.svg";
import UserIcon from "../../../../assets/svg/user.svg";
import PersonCarryBoxIcon from "../../../../assets/svg/person-carry-box-regular.svg";
import RoomIcon from "../../../../assets/svg/room/VectorRoom.svg";
import PrinterIcon from "../../../../assets/svg/printer.svg";
import ConciergeIcon from "../../../../assets/svg/concierge.svg";
import WifiIcon from "../../../../assets/svg/amenities/wifi.svg";
import ParkingIcon from "../../../../assets/svg/amenities/parking.svg";
import ElevatorIcon from "../../../../assets/svg/amenities/elevator.svg";
import SecurityIcon from "../../../../assets/svg/amenities/security.svg";
import CameraIcon from "../../../../assets/svg/amenities/camera.svg";
import SupportIcon from "../../../../assets/svg/amenities/support.svg";
import CleaningIcon from "../../../../assets/svg/amenities/cleaning.svg";
import AddIcon from "@mui/icons-material/Add";
import OptionalInformationForm from "./OptionalInformationForm";
import Grid4Blue from "../../../../assets/svg/qr-code-blue.svg";
import BikeIcon from "../../../../assets/svg/amenities/bikeSharing.svg";
import BreakfastIcon from "../../../../assets/svg/amenities/breakfast.svg";
import CarIcon from "../../../../assets/svg/amenities/carSharing.svg";
import CoffeeIcon from "../../../../assets/svg/amenities/coffeeWater.svg";
import GymIcon from "../../../../assets/svg/amenities/gym.svg";
import MeetingIcon from "../../../../assets/svg/amenities/fullMeetingRoom.svg";
import LoungeIcon from "../../../../assets/svg/amenities/comfortableLounge.svg";
import ManagerIcon from "../../../../assets/svg/amenities/communityManager.svg";
import CompanyIcon from "../../../../assets/svg/amenities/companyAddress.svg";
import InternetIcon from "../../../../assets/svg/amenities/highSpeedInternet.svg";
import KidIcon from "../../../../assets/svg/amenities/kidsRoom.svg";
import OSIcon from "../../../../assets/svg/amenities/orangeryOSapp.svg";
import BusinessIcon from "../../../../assets/svg/amenities/orangeryBusiness.svg";
import StylishIcon from "../../../../assets/svg/amenities/stylish.svg";
export class OfficeGuidelineState {
  public uuid;
  public introduction;
  public community_manager_uuids;
  public amenities;
  public image_uuids;
  public optional_information;
  public error = "";

  private officeGuideline;

  constructor(officeGuideline?: IOfficeGuideline) {
    this.officeGuideline = officeGuideline;
    if (officeGuideline) {
      this.uuid = new ValueState(officeGuideline.uuid);
      this.introduction = new ValueState(officeGuideline.introduction);
      this.community_manager_uuids = new ArrayValueState(
        officeGuideline.community_managers.map((cm) => cm.uuid)
      );
      this.amenities = new ValueState(officeGuideline.amenities);
      this.image_uuids = new ArrayValueState(
        officeGuideline.images?.map((image) => image.uuid)
      );
      this.optional_information = new ArrayValueState<any>(
        officeGuideline.optional_information.map((oi) => ({
          uuid: oi.uuid,
          title: oi.title,
          description: oi.description,
          image_uuids: oi.images?.map((im) => im.uuid),
        })) ?? ([] as IOptionalInformationUpdateParams[])
      );
    } else {
      this.uuid = new ValueState("");
      this.introduction = new ValueState("");
      this.community_manager_uuids = new ArrayValueState([]);
      this.amenities = new ValueState([]);
      this.image_uuids = new ArrayValueState([]);
      this.optional_information = new ArrayValueState(
        [] as IOptionalInformationUpdateParams[]
      );
    }

    makeAutoObservable(this);
  }

  reset = () => {
    let officeGuideline = this.officeGuideline;
    if (officeGuideline) {
      this.uuid = new ValueState(officeGuideline.uuid);
      this.introduction = new ValueState(officeGuideline.introduction);
      this.community_manager_uuids = new ArrayValueState(
        officeGuideline.community_managers.map((cm) => cm.uuid)
      );
      this.amenities = new ValueState(officeGuideline.amenities);
      this.image_uuids = new ArrayValueState(
        officeGuideline.images?.map((image) => image.uuid) ?? ([] as string[])
      );
      this.optional_information = new ArrayValueState<any>(
        officeGuideline.optional_information.map((oi) => ({
          uuid: oi.uuid,
          title: oi.title,
          description: oi.description,
          image_uuids: oi.images?.map((im) => im.uuid),
        })) ?? ([] as IOptionalInformationUpdateParams[])
      );
    } else {
      this.uuid = new ValueState("");
      this.introduction = new ValueState("");
      this.community_manager_uuids = new ArrayValueState([]);
      this.amenities = new ValueState([]);
      this.image_uuids = new ArrayValueState([] as string[]);
      this.optional_information = new ArrayValueState(
        [] as IOptionalInformationUpdateParams[]
      );
    }
  };

  get data() {
    return {
      uuid: this.uuid.value,
      name: this.introduction.value,
      introduction: this.introduction.value,
      community_manager_uuids: this.community_manager_uuids.values.map(
        (cm) => cm.value
      ),
      amenities: this.amenities.value,
      image_uuids: this.image_uuids.values?.map((im) => im.value),
      optional_information: this.optional_information.values?.map(
        (oi) => oi.value
      ),
    };
  }

  clearErrors() {
    this.introduction.clearError();
    this.community_manager_uuids.clearError();
    this.amenities.clearError();
    this.image_uuids.clearError();
    this.optional_information.clearError();
    this.error = "";
  }

  validate() {
    let valid = true;
    this.clearErrors();
    if (!this.introduction.value) {
      this.introduction.error = "Please fill the office guideline introduction";
      valid = false;
    }
    if (!this.community_manager_uuids.values) {
      this.community_manager_uuids.error =
        "Please choose at least one community manager";
      valid = false;
    }
    if (!this.amenities.value) {
      this.amenities.error = "Please choose at least one amenity";
      valid = false;
    }
    return valid;
  }

  setupErrors(err: FormError) {
    this.clearErrors();
    err.errors.forEach((error) => this.setupError(error));
  }

  setupError(error: FieldError) {
    if (error.field === "") {
      this.error = error.error;
    } else if (error.field === "introduction") {
      this.introduction.error = error.error;
    } else if (error.field === "community_manager_uuids") {
      this.community_manager_uuids.error = error.error;
    } else if (error.field === "amenities") {
      this.amenities.error = error.error;
    }
  }
}

export default function OfficeGuidelineForm({
  loading,
}: {
  loading?: JSX.Element;
}) {
  const globalState = useGlobalState();
  const office = globalState.currentOffice;
  const { data: officeGuideline, isLoading } = useOfficeGuideline(
    globalState.office_uuid
  );
  const { data: amenities } = useAmenities(globalState.office_uuid);
  const [editMode, setEditMode] = React.useState(false);
  const mutation = useUpdateOfficeGuideline();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editMode) {
      if (!state.validate()) {
        return;
      }
      try {
        const result = await mutation.mutateAsync(state.data);
        OrangeryToast("Office guideline successfully edited", "success");
        setEditMode(false);
      } catch (err: any) {
        state.setupErrors(err);
        setEditMode(true);
      }
    } else {
      setEditMode(true);
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    state.reset();
    setEditMode(false);
  }

  const state = React.useMemo(
    () => new OfficeGuidelineState(officeGuideline),
    [officeGuideline]
  );

  const handleOptionalInformationChange = (
    optionalInformation: IOptionalInformationUpdateParams,
    indexKey: number
  ) => {
    state.optional_information.updateElementValue(
      optionalInformation,
      indexKey
    );
  };

  const handleOptionalInformationRemove = (indexKey: number) => {
    state.optional_information.deleteElementValue(indexKey);
  };

  function handleDownloadQRCode() {
    window.open(
      `${process.env.NEXT_PUBLIC_CDN_URL}/${office?.qr_code}.jpg`,
      "_blank"
    );
  }

  // interface IAmenities {
  //   icon: ReactJSXElement;
  //   amenity: string;
  // }
  // const amenities = [
  //   { icon: <ConciergeIcon />, amenity: "Concierge" },
  //   { icon: <PersonCarryBoxIcon />, amenity: "Delivery" },
  //   { icon: <RoomIcon />, amenity: "Private rooms" },
  //   { icon: <PrinterIcon />, amenity: "Printer" },
  // ];

  const iconStyle = { height: "1.2rem", width: "1.2rem" };

  const amenitiesIcons = [
    <ConciergeIcon key={1} />,
    <PrinterIcon key={2} />,
    <RoomIcon key={3} />,
    <PersonCarryBoxIcon key={4} />,
    <WifiIcon key={5} style={iconStyle} />,
    <ParkingIcon key={6} style={iconStyle} />,
    <ElevatorIcon key={7} style={iconStyle} />,
    <SecurityIcon key={8} style={iconStyle} />,
    <CameraIcon key={9} style={iconStyle} />,
    <SupportIcon key={10} style={iconStyle} />,
    <CleaningIcon key={11} style={iconStyle} />,
    <InternetIcon key={12} style={iconStyle} />,
    <StylishIcon key={13} style={iconStyle} />,
    <PrinterIcon key={14} style={iconStyle} />,
    <CarIcon key={15} style={iconStyle} />,
    <BikeIcon key={16} style={iconStyle} />,
    <ManagerIcon key={17} style={iconStyle} />,
    <CompanyIcon key={18} style={iconStyle} />,
    <PersonCarryBoxIcon key={19} style={iconStyle} />,
    <BusinessIcon key={20} style={iconStyle} />,
    <ParkingIcon key={21} style={iconStyle} />,
    <OSIcon key={22} style={iconStyle} />,
    <SupportIcon key={23} style={iconStyle} />,
    <GymIcon key={24} style={iconStyle} />,
    <KidIcon key={25} style={iconStyle} />,
    <LoungeIcon key={26} style={iconStyle} />,
    <MeetingIcon key={27} style={iconStyle} />,
    <BreakfastIcon key={28} style={iconStyle} />,
    <CoffeeIcon key={29} style={iconStyle} />,
  ];

  return (
    <>
      {isLoading ? (
        loading
      ) : (
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              // boxShadow: { xs: "none", md: "1px 1px 3px #eaeaea" },
              padding: { xs: 0, sm: 2, md: 2 },
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                px: 2,
                overflowY: "auto",
                height: "calc(100% - 12px)",
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
              <Box sx={{ display: "flex", mb: { xs: 3, sm: 3 } }}>
                <Button
                  onClick={handleDownloadQRCode}
                  sx={{
                    width: 250,
                    height: 55,
                    fontSize: 20,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#F9F9FA",
                  }}
                >
                  <Grid4Blue />

                  <Typography sx={{ color: "#074EE8", pl: 1.5 }}>
                    Download your QR
                  </Typography>
                </Button>
                <Box
                  width={
                    editMode
                      ? { xs: "60%", md: "30%" }
                      : { xs: "30%", md: "15%" }
                  }
                  mb={{ xs: 3, md: 2 }}
                  sx={{
                    margin: "0 0 0 auto",
                    display: "flex",
                  }}
                >
                  {editMode && (
                    <Button
                      color="primary"
                      onClick={handleCancel}
                      sx={{
                        flexGrow: 1,
                        flexShrink: 1,
                        height: 55,
                        fontSize: 20,
                        mr: 3,
                        color: (theme) => theme.palette.grey.A200,
                        backgroundColor: "white",
                        border: "1px solid #2B2E33",
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      "& > *:first-child": { mx: 0 },
                      "& .edit-icon": { width: "1.3rem", height: "1.3rem" },
                      "& .MuiButton-root": { minWidth: 40 },
                      flexGrow: 1,
                      flexShrink: 1,
                      height: 55,
                      justifyContent: "space-between",
                    }}
                    startIcon={
                      editMode || <EditPenIcon className="edit-icon" />
                    }
                    endIcon={
                      editMode || (
                        <ArrowForwardIcon
                          fontSize="large"
                          sx={{ visibility: "hidden" }}
                        />
                      )
                    }
                    onClick={handleSubmit}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 400,
                        color: "#fff",
                      }}
                    >
                      {editMode ? "Save" : "Edit"}
                    </Typography>
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  mb: 1,
                  mx: "auto",
                  my: "auto",
                  width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                }}
              >
                <Grid
                  container
                  spacing={1}
                  sx={{
                    maxWidth: {
                      xs: "100",
                      sm: "100%",
                      md: "100%",
                    },
                  }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        // maxHeight: "100vh",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          mb: 5,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ mr: 2, flexShrink: "0" }}
                        >
                          General information
                        </Typography>
                        <hr style={{ width: "100%", margin: 0 }} />
                      </Box>

                      <Observer>
                        {() => (
                          <>
                            {editMode ? (
                              <OrangeryTextAreaField
                                disabled={!editMode}
                                placeholder={"Enter introduction"}
                                name="introduction"
                                label="INTRODUCTION"
                                multiline
                                rows={20}
                                sx={{
                                  mb: 10,
                                  "& .MuiOutlinedInput-input": {
                                    height: "200px !important",
                                  },
                                }}
                                value={state.introduction.value}
                                helperText={state.introduction.error}
                                onChange={(e: any) =>
                                  (state.introduction.value = e.target.value)
                                }
                                error={!!state.introduction.error}
                              />
                            ) : state.introduction.value ? (
                              <Box
                                sx={{
                                  mb: 8,
                                }}
                              >
                                <Typography
                                  sx={{
                                    mb: 1,
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    color: "primary.main",
                                  }}
                                >
                                  INTRODUCTION
                                </Typography>
                                <Box
                                  component="div"
                                  sx={{
                                    textOverflow: "clip",
                                    width: "100%",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {officeGuideline?.introduction}
                                </Box>
                              </Box>
                            ) : (
                              <Typography
                                sx={{
                                  textAlign: "left",
                                  mb: 12,
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "primary.main",
                                }}
                              >
                                INTRODUCTION
                              </Typography>
                            )}
                          </>
                        )}
                      </Observer>
                      <Observer>
                        {() => (
                          <OrangeryEmployeesAvatarAutocomplete
                            viewMode={!editMode}
                            sx={{
                              mb: 10,
                            }}
                            label="COMMUNITY MANAGER"
                            editMode={!editMode}
                            value={state.community_manager_uuids.values.map(
                              (e) => e.value
                            )}
                            onChange={(newValues?) => {
                              newValues.forEach((e) => {
                                const i =
                                  state.community_manager_uuids.values.findIndex(
                                    (v) => v.value === e
                                  );
                                if (i === -1) {
                                  state.community_manager_uuids.pushElementValue(
                                    e
                                  );
                                }
                              });
                              state.community_manager_uuids.values.forEach(
                                (v, j) => {
                                  const i = newValues.findIndex(
                                    (e) => v.value === e
                                  );
                                  if (i === -1) {
                                    state.community_manager_uuids.deleteElementValue(
                                      j
                                    );
                                  }
                                }
                              );
                            }}
                          />
                        )}
                      </Observer>
                      <Observer>
                        {() => (
                          <Autocomplete
                            readOnly={!editMode}
                            forcePopupIcon={editMode}
                            sx={
                              !editMode
                                ? {
                                    ml: -2,
                                    "&.MuiAutocomplete-root-disabled": {
                                      opacity: 1,
                                    },
                                    "&.MuiAutocomplete-root fieldset": {
                                      border:
                                        "1px solid transparent !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "transparent !important",
                                      color: "red",
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "18px",
                                      fontWeight: 700,
                                      color: "primary.main",
                                      lineHeight: 1.5,
                                    },
                                    mb: 5,
                                  }
                                : { mb: 5 }
                            }
                            // disabled={!editMode}
                            options={amenities?.data || []}
                            renderOption={(props, option) => (
                              <li {...props}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: "1.3rem",
                                      width: "1.3rem",
                                      mr: 1,
                                    }}
                                  >
                                    {
                                      amenitiesIcons[
                                        amenities?.data?.indexOf(option) || 0
                                      ]
                                    }
                                  </Box>
                                  {option}
                                </Box>
                              </li>
                            )}
                            getOptionLabel={(option) => option}
                            multiple
                            value={state.data.amenities || []}
                            onChange={(_, newValues) => {
                              state.amenities.value = newValues.filter(
                                (newValue) => newValue
                              );
                            }}
                            // isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
                            renderInput={(params) => (
                              <TextField
                                label={"AMENITIES"}
                                {...params}
                                InputLabelProps={{
                                  ...params.InputLabelProps,
                                  shrink: true,
                                }}
                                placeholder={editMode ? "Select amenities" : ""}
                                sx={{
                                  "& .MuiAutocomplete-input": { ml: 2 },
                                  "MuiOutlinedInput-notchedOutline": {
                                    color: "red",
                                  },
                                }}
                              />
                            )}
                            renderTags={(value: string[], getTagProps) =>
                              value.map((option: string, index: number) => (
                                <Chip
                                  size="medium"
                                  {...getTagProps({ index })}
                                  variant="outlined"
                                  label={option}
                                  key={option}
                                  icon={
                                    <Box
                                      sx={{
                                        height: "1.2rem",
                                        width: "1.2rem",
                                      }}
                                    >
                                      {
                                        amenitiesIcons[
                                          amenities?.data?.indexOf(option) || 0
                                        ]
                                      }
                                    </Box>
                                  }
                                  sx={{
                                    height: 50,
                                    fontSize: 14,
                                    borderRadius: "5px",
                                    backgroundColor: "#F7F8FA",
                                    border: "none",
                                    p: 1,
                                  }}
                                />
                              ))
                            }
                          />
                        )}
                      </Observer>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          backgroundColor: editMode ? "#F7F8FA" : "transparent",
                          borderRadius: "15px",
                          px: editMode ? 2 : 0,
                          py: 2,
                          mt: 4,
                          mb: { xs: 4, sm: 4, md: 2 },
                        }}
                      >
                        <Typography
                          sx={{
                            color: editMode
                              ? "rgba(0, 0, 0, 0.6)"
                              : "primary.main",
                            fontWeight: editMode ? 400 : 700,
                            fontSize: "14px",
                            lineHeight: "1.5",
                            mb: 2,
                          }}
                        >
                          COVER PHOTOS
                        </Typography>
                        {editMode ? (
                          <Observer>
                            {() => (
                              <Box sx={{ width: "40%" }}>
                                <OrangeryImagesField
                                  images={state.image_uuids.values?.map(
                                    (v) => v.value
                                  )}
                                  onAdd={(uuid) => {
                                    state.image_uuids.pushElementValue(uuid);
                                  }}
                                  onRemove={(uuid) => {
                                    const i =
                                      state.image_uuids.values.findIndex(
                                        (v) => v.value === uuid
                                      );
                                    if (i !== -1) {
                                      state.image_uuids.deleteElementValue(i);
                                    }
                                  }}
                                />
                              </Box>
                            )}
                          </Observer>
                        ) : state.image_uuids.values?.length > 0 ? (
                          <Box sx={{ mx: 0, my: 1 }}>
                            <OrangeryAttachmentsButton
                              media={state.image_uuids.values?.map((v) => ({
                                uuid: v.value,
                                is_image: true,
                                is_document: false,
                              }))}
                            />
                          </Box>
                        ) : (
                          <></>
                          // <Typography sx={{ ml: 1 }}>No Photos</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        ml: { xs: 0, sm: 0, md: 0, lg: 5 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ mr: 2, flexShrink: "0" }}
                        >
                          Optional information
                        </Typography>
                        <hr style={{ width: "100%", margin: 0 }} />
                      </Box>
                      <Observer>
                        {() => (
                          <>
                            {state.optional_information.values?.length < 1 && (
                              <Box
                                sx={{
                                  textAlign: "center",
                                  mt: 10,
                                  color: !editMode ? "gray" : "black",
                                }}
                              >
                                {!editMode
                                  ? "There is no optional information section"
                                  : "Add new sections as the optional office guidelines"}
                              </Box>
                            )}
                          </>
                        )}
                      </Observer>
                      <Observer>
                        {() => (
                          <>
                            {state.optional_information.values.length > 0 &&
                            editMode ? (
                              <>
                                {state.optional_information.values?.map(
                                  (form, idx) => {
                                    return (
                                      <OptionalInformationForm
                                        optionalInformation={form.value}
                                        onChange={(
                                          optionalInformation: IOptionalInformationUpdateParams
                                        ) => {
                                          handleOptionalInformationChange(
                                            optionalInformation,
                                            idx
                                          );
                                        }}
                                        onRemove={() => {
                                          handleOptionalInformationRemove(idx);
                                        }}
                                        key={idx}
                                        editMode={editMode}
                                      />
                                    );
                                  }
                                )}
                              </>
                            ) : (
                              <>
                                {state.optional_information.values?.map(
                                  (form, idx) => {
                                    return (
                                      <Box
                                        sx={{
                                          mb: 4,
                                          mt: 4,
                                        }}
                                        key={idx}
                                      >
                                        <Typography
                                          sx={{
                                            mb: 1,
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            color: "primary.main",
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          TITLE
                                        </Typography>
                                        <Typography
                                          sx={{
                                            mb: 2,
                                            wordWrap: "break-word",
                                          }}
                                        >
                                          {form.value.title}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            mb: 1,
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            color: "primary.main",
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          DESCRIPTION
                                        </Typography>
                                        <Typography
                                          sx={{
                                            wordWrap: "break-word",
                                            mb: 2,
                                          }}
                                        >
                                          {form.value.description}
                                        </Typography>
                                        {form.value.image_uuids?.length > 0 ? (
                                          <OrangeryAttachmentsButton
                                            media={form.value.image_uuids?.map(
                                              (v: string) => ({
                                                uuid: v,
                                                is_image: true,
                                                is_document: false,
                                              })
                                            )}
                                          />
                                        ) : (
                                          <></>
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Observer>
                      {editMode && (
                        <Button
                          variant="contained"
                          color="primary"
                          aria-label="add"
                          sx={{
                            "& .add-btn": {
                              fontSize: 13,
                              fontWeight: 400,
                              color: "#fff",
                            },
                            py: "12px",
                            px: 2,
                            mt: 4,
                            gap: "10px",
                            width: 160,
                            alignSelf: "center",
                          }}
                          onClick={() => {
                            state.optional_information.pushElementValue({
                              title: "",
                              description: "",
                            });
                          }}
                        >
                          {" "}
                          <AddIcon sx={{ marginLeft: "-10px" }} />
                          <Typography className="add-btn">
                            Add Section
                          </Typography>
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          <FormErrorMessage state={state} />
        </form>
      )}
    </>
  );
}

function FormErrorMessage({ state }: { state: { error: string } }) {
  return (
    <Observer>{() => <>{state.error && <div>{state.error}</div>}</>}</Observer>
  );
}
