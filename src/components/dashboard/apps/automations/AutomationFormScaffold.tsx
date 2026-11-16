//React and Next
import React, { useEffect } from "react";
import Router from "next/router";
//MUI
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
//Orangery elements & internal dependencies
import { OrangeryText } from "../../../OrangeryElements";
import { Observer } from "mobx-react-lite";

// icons, images & colors
import AutomationsLogo from "../../../../assets/svg/apps/automations/automations-logo.svg";
import LeftArrow from "../../../../assets/svg/apps/automations/arrow-left.svg";
import InfoIcon from "../../../../assets/svg/apps/automations/info.svg";
import CheckIcon from "../../../../assets/svg/apps/googleAdminResources/check-green.svg";
import CrossIcon from "../../../../assets/svg/apps/googleAdminResources/cross-red.svg";
import { AutomationFormState } from "./AutomationForm";
import { productType, IProductType } from "../../tenants/offersTab/ProductType";

//Queries & Backend
import { useDoors } from "../../../../queries/apps/saltoKs";
import { useAllOffers } from "../../../../queries/apps/automations";
import { useGroups } from "../../../../queries/group";
import { useOffices } from "../../../../queries/office";

export default function AutomationFormScaffold({
  mainTitle,
  leftList,
  rightList,
}: {
  mainTitle?: any;
  leftList?: any;
  rightList?: any;
}) {
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          height: "100%",
          // minHeight: 666,
          borderRadius: 1.5,
          py: 3,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
          <Button
            onClick={() => (Router.push("/dashboard/apps/automations"))}
            startIcon={<LeftArrow />} sx={{ width: 200 }}>Back to Automations list</Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AutomationsLogo style={{ height: 43 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
              <Typography sx={{ ml: 2, fontSize: 25, fontWeight: 700 }}>
                Create an Automation Flow
              </Typography>
              <Typography sx={{ ml: 2, fontSize: 16, fontWeight: 600, color: '#A5AAB4' }}>
                Here are you can create an flexible automation flow for doors
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            pr: 1,
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: 2.5,
            mt: 3,
            pt: 0.5,
            pb: 0.5,
            pl: 0.5,
            height: "100%",
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
          <>
            <Grid container spacing={2} sx={{ pr: 8 }}>
              <Grid
                display={'flex'}
                flexDirection={'column'}
                item
                xs={12}
                md={6}
                sx={{ position: "relative" }}
              >
                {leftList}
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                lg={6}
                sx={{
                  display: "flex",
                  alignSelf: "start",
                  justifyContent: { xs: "center", lg: "end" },
                  position: { xs: "static", lg: "absolute" },
                  right: { xs: 0, lg: 35 },
                }}
              >
                {rightList}
              </Grid>
            </Grid>
          </>
        </Box>
      </Box>
    </Box>
  );
}

export function AutomationFlowPreview({ state, editMode }
  :
  { state: AutomationFormState; editMode?: boolean }) {

  const {
    data: locks,
    isLoading: locksLoading,
  } = useDoors();

  const {
    data: offers,
    isLoading,
    isError,
  } = useAllOffers();

  const {
    data: groups,
    isLoading: groupsIsLoading
  } = useGroups();

  const {
    data: offices,
    isLoading: isLoadingOffice,
  } = useOffices();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: { xs: "100%", md: 460 },
          // height: "80%",
          minHeight: "40vh",
          width: 320,
          maxHeight: "50vh",
          borderRadius: "15px",
          border: "1px solid #2B2E33",
          p: 2,
          mt: { xs: 5, md: 0 },
        }}
      >
        <Box sx={{ display: 'flex', columnGap: 1.5, alignItems: 'center' }}>
          <AutomationsLogo style={{ height: 32 }} />
          <Typography
            color="primary.light"
            sx={{ fontSize: 16, fontWeight: 700 }}
          >
            Your Automation Flow Preview
          </Typography>
        </Box>
        <Observer>
          {() => (
            <Box
              sx={{
                mt: 2,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                height: `calc(100% - 5px)`,
                justifyContent: "start",
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

              <AutomationFlowStepsCard step={1}
                mode={state.mode(0)}
                title={state.name.value} />
              <AutomationFlowStepsCard step={2}
                list={state.doors.values.filter((door) => door.value).map((door) => locks?.find((lock) => lock.lock_id === door.value)?.lock_name)}
                mode={state.mode(1)}
                title={state.doors.values.length === 0
                  ? undefined
                  : state.doors.values.length === 1
                    ? state.doors.values.length.toString() + ' Door'
                    : state.doors.values.length.toString() + ' Doors'}
              />
              <AutomationFlowStepsCard step={3}
                list={state.offer_types.values.filter((offerType) => offerType.value).map((offerType) => productType?.find((pT) => pT.value === offerType.value)?.name)}
                mode={state.mode(2)}
                title={state.offer_types.values.length === 0 && state.mode(2) !== 'done' && !editMode
                  ? undefined
                  : editMode && state.offer_types.values.length <= 1
                    ? 'Offer Type'
                    : editMode && state.offer_types.values.length > 1
                      ? 'Offer Types'
                      : state.offer_types.values.length === 0
                        ? 'Offer Type'
                        : state.offer_types.values.length === 1
                          ? state.offer_types.values.length.toString() + ' Offer Type'
                          : state.offer_types.values.length.toString() + ' Offer Types'}
                subtitle2={state.offer_types.values.length === 0 ? '-' : undefined}
              />
              <AutomationFlowStepsCard step={4}
                list={state.offers.values.filter((offer) => offer.value).map((offer) => offers?.find((item) => item.uuid === offer.value)?.name)}
                mode={state.mode(3)}
                title={state.offers.values.length === 0 && state.mode(3) !== 'done' && !editMode
                  ? undefined
                  : editMode && state.offers.values.length <= 1
                    ? 'Offer'
                    : editMode && state.offers.values.length > 1
                      ? 'Offers'
                      : state.offers.values.length === 0
                        ? 'Offer'
                        : state.offers.values.length === 1
                          ? state.offers.values.length.toString() + ' Offer'
                          : state.offers.values.length.toString() + ' Offers'}
                subtitle2={state.offers.values.length === 0 ? '-' : undefined}
              />
              <AutomationFlowStepsCard step={5}
                list={state.groups.values.filter((group) => group.value).map((group) => groups?.find((gp) => gp.name === group.value)?.display_name)}
                mode={state.mode(4)}
                title={state.groups.values.length === 0 && state.mode(4) !== 'done' && !editMode
                  ? undefined
                  : editMode && state.groups.values.length <= 1
                    ? 'User Role'
                    : editMode && state.groups.values.length > 1
                      ? 'User Roles'
                      : state.groups.values.length === 0
                        ? 'User Role'
                        : state.groups.values.length === 1
                          ? state.groups.values.length.toString() + ' User Role'
                          : state.groups.values.length.toString() + ' User Roles'}
                subtitle2={state.groups.values.length === 0
                  ? '-'
                  : undefined}
              />
              <AutomationFlowStepsCard step={6}
                mode={state.mode(5)}
                title={offices?.filter((office) => office.uuid === state.office.value)[0]?.name} />
              <AutomationFlowStepsCard step={7}
                mode={state.mode(6)}
                title={state.mode(6) === 'active' || state.mode(6) === 'done' || editMode
                  ? 'Door Access Duration'
                  : ''}
                subtitle1={state.accessFromTime.value
                  ? ('From: ' + new Date(state.accessFromTime.value ?? '').toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h24",
                  }) || "-")
                  : undefined}
                subtitle2={state.accessFromTime.value
                  ? ('To: ' + new Date(state.accessUntilTime.value ?? '').toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h24",
                  }) || "-")
                  : undefined} />
              <AutomationFlowStepsCard step={8}
                lastItem
                mode={state.mode(7)}
                title={state.mode(7) === 'active' || state.activeFrom.value || editMode
                  ? 'Validation Date and Time' : ''}
                subtitle1={state.activeFrom.value
                  ? ('From: ' + new Date(state.activeFrom.value ?? '').toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h24",
                  }) || "-")
                  : undefined}
                subtitle2={state.activeUntil.value
                  ? ('To: ' + new Date(state.activeUntil.value ?? '').toLocaleString("de-DE", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h24",
                  }) || "-")
                  : undefined} />
            </Box>
          )}
        </Observer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 1.5,
          maxWidth: { xs: "100%", md: 460 },
          width: 320,
          height: 200,
          borderRadius: "15px",
          border: "1px solid #EDEEF0",
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
          <InfoIcon />
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#55585C' }}>Hints</Typography>
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#A5AAB4' }}>
          You can create an editable automation flow for door accesses by adding doors, offer types, specific offers, the office, door access duration, and validation date and time.
        </Typography>
      </Box>
    </Box>
  );
}

export function AutomationFlowStepsCard({
  active,
  step,
  mode,
  title,
  list,
  subtitle1,
  subtitle2,
  lastItem,
}: {
  active?: boolean;
  step: number;
  mode: string;
  title?: string | undefined;
  list?: any;
  subtitle1?: string | undefined;
  subtitle2?: string | undefined;
  lastItem?: boolean;
}) {
  return (
    <Box>
      <Box
        sx={{
          height: 'fit-content',
          backgroundColor: mode === 'active' ? '#F9F9FA' : '#FFF',
          borderRadius: '10px',
          pt: 1.5, pl: 1.3, pr: 2.8,
          display: 'flex',
          flexDirection: "column",
          position: 'relative',
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: 0.5
          }}>
          <Box sx={{
            width: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: mode === 'active' ? '#F9D507' : mode === 'done' ? '#000' : '#FFF',
            fontSize: 14,
            fontWeight: 700, color: mode === 'active' ? '#2B2E33' : mode === 'done' ? '#FFF' : '#A5AAB4',
            borderRadius: '100%', border: mode === 'active' ? '1px solid #2B2E33' : '1px solid #A5AAB4',
          }}>
            {step.toString()}
          </Box>

          {(mode === 'active' || mode === 'inactive') && !title ?
            (<Box
              sx={{
                height: 6, width: '100%',
                backgroundColor: '#EDEEF0',
                borderRadius: '30px'
              }} >{' '}</Box>)
            : (<Typography
              sx={{ fontSize: 14, fontWeight: 600 }}>
              {title}
            </Typography>)}
        </Box>
        <Box sx={{
          height: 'fit-content',
          width: '100',
          borderLeft: !lastItem ? '1px solid #000' : 'unset',
          minHeight: 18,
          ml: 1.4,
          mt: 0.8,
          px: 2,
          zIndex: 1,

        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 0.5,
            mb: 1,
          }}>
            {list?.map((item: any, idx: any) =>
              <Typography
                key={idx}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#A5AAB4'
                }}>
                {item}
              </Typography>
            ) ?? ''}
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#A5AAB4'
              }}>
              {subtitle1}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#A5AAB4'
              }}>
              {subtitle2}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}