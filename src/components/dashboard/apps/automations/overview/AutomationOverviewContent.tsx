//Next
import Router from "next/router";
//MUI
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
//Queries & Backend
import {
  IAutomation,
} from "../../../../../queries/apps/automations";
import { productType, IProductType } from "../../../tenants/offersTab/ProductType";
//SVG
import CrossIcon from "../../../../../assets/svg/cross.svg";
import { useGroups } from "../../../../../queries/group";




export default function AutomationOverviewContent({
  automationResult,
  automation,
  handleClose,
}: {
  automation: IAutomation;
  automationResult?: IAutomation;
  handleClose?: () => void;
}) {

  return (
    <>
      <Box
        sx={{
          height: "100%",
          "& .footer": {
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
            px: 4,
            py: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            py: 4,
            px: 4,
            "& .form-title": { flexGrow: 1 },
            "& .cancel-icon": {
              width: "1.3rem",
              height: "1.3rem",
              color: "black",
            },
          }}
        >
          <Typography fontSize={24} fontWeight={600} className="form-title">
            {automation.name} / Preview
          </Typography>
          <IconButton onClick={handleClose}>
            <CrossIcon className="cancel-icon" />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            // mt: 2,
            mr: 2,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 210px)",
            overflowY: "auto",
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
            p: 2.5,
            rowGap: 1,
            "& .right-box": { width: "60%" },
          }}
        >
          <OverviewContent automation={automation} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: "19px",
            paddingRight: "24px",
            borderTop: "1px solid #EDEEF0",
            width: "100%",
            display: "flex",
            justifyContent: "end",
            paddingTop: "21px",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ fontSize: 20, px: 8, py: 2, height: 55 }}
          >
            OK
          </Button>
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: "19px",
            paddingLeft: "24px",


            display: "flex",
            justifyContent: "start",
            paddingTop: "21px",
          }}
        >
          <Button
            onClick={() => Router.push(`/dashboard/apps/automations/?id=${automation.uuid}`)}
            variant="outlined"

            sx={{ fontSize: 16, fontWeight: 600, px: 0, py: 2, width: 229, height: 55 }}
          >
            Edit This Automation Flow
          </Button>
        </Box>
      </Box>
    </>
  );
}


const OverviewContent = ({ automation }: { automation: IAutomation }) => {

  const { data: groups, isLoading: groupsIsLoading } = useGroups();

  return (
    <>
      <OverviewContentCard automationUuid={automation.uuid} title={automation.name} number={1} />
      <OverviewContentCard automationUuid={automation.uuid} title={automation.doors.length.toString() + " " +
        (automation.doors.length <= 1
          ? "Door"
          : "Doors")} number={2} >
        {automation.doors && Array.isArray(automation.doors)
          && automation.doors.map((door, index) => (
            <Box key={door.uuid}
              sx={{
                display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                mt: 1, borderBottom: index === automation.doors.length - 1
                  ? 'none'
                  : '1px solid #EDEEF0', pb: 1,
              }}>
              <Typography color={'primary.main'}
                sx={{ fontSize: 14, fontWeight: 600 }}>
                {door.lock_name || "-"}
              </Typography>
              <Typography color={'primary.main'}
                sx={{ pr: door.lock_location ? 4 : 'unset', fontSize: 14, fontWeight: 600 }}>
                {door.lock_location ?? "-"}
              </Typography>
            </Box>
          ))}
      </OverviewContentCard>
      <OverviewContentCard automationUuid={automation.uuid} horizontal
        title={automation.offer_types.length.toString() + " " + (automation.offer_types.length <= 1
          ? "Offer Type"
          : "Offer Types")} number={3} >
        {automation.offer_types && Array.isArray(automation.offer_types)
          && automation.offer_types.map((offerType, index) => (
            <Box key={index}
              sx={{
                display: 'flex',
                alignItems: 'center', p: 1,
                borderRight: index === automation.offer_types.length - 1
                  ? 'none'
                  : '1px solid #C9CCD2',
              }}>
              <Typography color={'primary.main'}
                sx={{ fontSize: 14, fontWeight: 600 }}>
                {productType.filter((type) => offerType === type.value).map((type) => type.name) || "-"}
              </Typography>
            </Box>
          ))}
      </OverviewContentCard>
      <OverviewContentCard automationUuid={automation.uuid}
        title={automation.products.length.toString() + " " +
          (automation.products.length <= 1 ? "Offer" : "Offers")} number={4} >
        {automation.products && Array.isArray(automation.products) && automation.products.map((product, index) => (
          <Box key={product.uuid}
            sx={{
              mt: 1, borderBottom: index === automation.products.length - 1
                ? 'none'
                : '1px solid #EDEEF0', pb: 1,
            }}>
            <Typography color={'primary.main'}
              sx={{ fontSize: 14, fontWeight: 600 }}>
              {product.name || "-"}
            </Typography>
          </Box>
        ))}
      </OverviewContentCard>
      <OverviewContentCard
        automationUuid={automation.uuid}
        horizontal
        title={automation.groups.length.toString() + " " +
          (automation.groups.length <= 1
            ? "User Role"
            : "User Roles")} number={5} >
        {automation.groups && Array.isArray(automation.groups) && automation.groups.map((automationGroup, index) => (
          <Box key={index}
            sx={{
              display: 'flex',
              alignItems: 'center', p: 1,
              borderRight: index === automation.groups.length - 1
                ? 'none'
                : '1px solid #C9CCD2',
            }}>
            <Typography color={'primary.main'}
              sx={{ fontSize: 14, fontWeight: 600 }}>
              {groups && groups.filter((group) => group.name === automationGroup).map((displayName) => displayName.display_name) || "-"}
            </Typography>
          </Box>
        ))}
      </OverviewContentCard >
      <OverviewContentCard
        automationUuid={automation.uuid}
        horizontal
        title={automation.office?.name || "-"} number={6} />
      <OverviewContentCard
        automationUuid={automation.uuid}
        horizontal
        title={"Door Access Duration"} number={7} >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
          <Typography color={'primary.main'}
            sx={{ fontSize: 14, fontWeight: 600 }}>
            From:  {new Date(automation.access_from_time ?? '').toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            }) || "-"}
          </Typography>
          <Typography color={'primary.main'}
            sx={{ fontSize: 14, fontWeight: 600 }}>
            To: {new Date(automation.access_until_time ?? '').toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            }) || "-"}
          </Typography>
        </Box>
      </OverviewContentCard>
      <OverviewContentCard
        automationUuid={automation.uuid}
        horizontal
        title={"Validation Date and Time"} number={8} >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
          <Typography color={'primary.main'}
            sx={{ fontSize: 14, fontWeight: 600 }}>
            From:  {automation.active_from && new Date(automation.active_from ?? '').toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            }) || "-"}
          </Typography>
          <Typography color={'primary.main'}
            sx={{ fontSize: 14, fontWeight: 600 }}>
            To: {automation.active_until && new Date(automation.active_until ?? '').toLocaleString("de-DE", {
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            }) || "-"}
          </Typography>
        </Box>
      </OverviewContentCard>
    </>
  );
};


const OverviewContentCard = (
  { title,
    number,
    children,
    horizontal,
    automationUuid,
  }
    : {
      title: string;
      number: number;
      children?: React.ReactNode;
      horizontal?: boolean;
      automationUuid?: string;
    }) => {

  const handleClick = () => {
    Router.push(`/dashboard/apps/automations/?id=${automationUuid}&index=${(number - 1).toString()}`)
  }
  return (
    <>
      <Box
        sx={{ borderRadius: '10px', backgroundColor: '#F9F9FA', p: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
            <Box
              sx={{
                height: 32, width: 32,
                backgroundColor: 'primary.main', color: "#fff",
                borderRadius: '100%', display: 'flex',
                justifyContent: 'center', alignItems: 'center'
              }}>
              {number}
            </Box>
            <Typography
              color={'primary.main'}
              sx={{ fontSize: 16, fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>
          <Button
            onClick={handleClick}
            variant="outlined"
            sx={{ borderRadius: '45px', backgroundColor: '#fff', width: 78 }}>
            Edit
          </Button>
        </Box>
        <Box
          sx={{ pl: 5, mt: 1, display: 'flex', flexDirection: horizontal ? 'row' : 'column' }}>
          {children}
        </Box>
      </Box>
    </>
  );
};