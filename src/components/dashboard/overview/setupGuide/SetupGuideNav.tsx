// react & next
import { useState } from "react";
import { useRouter } from "next/router";
// external dependencies
import { Box, Dialog, DialogContent, Typography, Grid } from "@mui/material";

// orangery elements & internal dependencies
import { OrangeryCloseButton } from "../../../OrangeryElements";
import { useGlobalState } from "../../../../Contexts & Globals/GlobalContext";
import SetupGuideCard from "./SetupGuideCard";
import { LinkButton } from "./SetupGuideCard";
import { EmployeeForm } from "../../employees/EmployeeForm";
import VisitorForm from "../../visitors/VisitorForm";
import DeliveryAreaForm from "../../deliveries/deliveryAreasTab/DeliveryAreaForm";
import InventoryForm from "../../assets/AssetForm";

// queries & backend
import { IDashboard } from "../../../../queries/dashboard";

// icons, images & colors
import WarningIcon from "../../../../assets/svg/warning-yellow.svg";
import CheckIcon from "../../../../assets/svg/apps/googleAdminResources/check-green.svg";

export default function SetupGuideNav({ data }: { data?: IDashboard }) {
  const globalState = useGlobalState();
  const router = useRouter();
  const { setFirstView, firstView } = useGlobalState();
  const [activeForm, setActiveForm] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const forms = [
    {
      formName: "firstEmployee",
      form: <EmployeeForm handleClose={handleClose} updateDashboard />,
      check:
        data?.number_of_employees && data?.number_of_employees > 0
          ? true
          : false,
      checkEmployeeNumber:
        data?.number_of_employees &&
        data?.number_of_employees >= 1 &&
        data?.number_of_employees < 6
          ? true
          : false,
      formSize: { width: 1262 },
    },

    {
      formName: "visitorForm",
      form: <VisitorForm handleClose={handleClose} updateDashboard />,
      check: data?.has_visitors,
      formSize: { width: 900 },
    },
    {
      formName: "deliveryAreaForm",
      form: <DeliveryAreaForm handleClose={handleClose} updateDashboard />,
      check: data?.has_delivery_areas,
      formSize: { height: 395, width: 601 },
    },
    {
      formName: "inventoryForm",
      form: <InventoryForm handleClose={handleClose} updateDashboard />,
      check: data?.has_assets,
      formSize: { width: 1262 },
    },
  ];

  const LinkText = (formName: string, numberOfEmployees?: boolean) => {
    if (formName === "firstEmployee" && !numberOfEmployees) {
      return "Create an Employee";
    } else if (formName === "firstEmployee" && numberOfEmployees) {
      return "Add more Employees";
    } else if (formName === "visitorForm") {
      return "Create a Visitor";
    }
  };

  const ArrowCheck = (formName: string) => {
    if (formName === "visitorForm") {
      return !forms[1].check;
    } else if (formName === "deliveryAreaForm") {
      return forms[2].check;
    } else if (formName === "inventoryForm") {
      return forms[3].check;
    } else if (
      formName === "firstEmployee" &&
      data?.number_of_employees &&
      data?.number_of_employees < 1
    ) {
      return true;
    } else if (
      formName === "firstEmployee" &&
      data?.number_of_employees &&
      data?.number_of_employees >= 1 &&
      data?.number_of_employees < 6
    ) {
      return true;
    } else if (
      formName === "firstEmployee" &&
      data?.number_of_employees &&
      data?.number_of_employees >= 6
    ) {
      return false;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#FFF", p: 2, borderRadius: "20px", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContents: "justify-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 2 }}>
          Get started!
        </Typography>
        <OrangeryCloseButton
          onClose={() => setFirstView(!firstView)}
          noAbsolute={true}
          sx={{ mb: 2 }}
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <SetupGuideCard
            cardNumber="1"
            title="Add Users"
            description="Create a list of users in your dashboard and make it easy for them to access the facilities of offices."
            formLink={forms.slice(0, 2).map((item, index) => {
              return (
                <>
                  <LinkButton
                    key={index}
                    disabled={item.check && !item.checkEmployeeNumber}
                    sx={{
                      color:
                        item.check && !item.checkEmployeeNumber
                          ? "#55585C"
                          : "#074EE8",
                      cursor:
                        item.check && !item.checkEmployeeNumber
                          ? "auto"
                          : "pointer",
                      textDecoration:
                        item.check && !item.checkEmployeeNumber
                          ? "line-through"
                          : "none",
                    }}
                    clickHandler={() => {
                      if (index === 0 && !item.checkEmployeeNumber) {
                        setActiveForm(0);
                        setOpen(true);
                        return;
                      } else if (index === 0 && item.checkEmployeeNumber) {
                        router.push("/dashboard/user-console");
                        return;
                      }
                      setActiveForm(index);
                      setOpen(true);
                    }}
                    linkText={LinkText(item.formName, item.checkEmployeeNumber)}
                    icon={
                      item.check && !item.checkEmployeeNumber ? (
                        <CheckIcon />
                      ) : (
                        <WarningIcon />
                      )
                    }
                    withArrow={ArrowCheck(item.formName)}
                  />
                </>
              );
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <SetupGuideCard
            cardNumber="2"
            title="Delivery system"
            description="Enable users to get packages quickly when they arrive to the office, by automating getting notified and signing process."
            formLink={
              <LinkButton
                disabled={forms[2].check}
                sx={{
                  color: forms[2].check ? "#55585C" : "#074EE8",
                  cursor: forms[2].check ? "auto" : "pointer",
                  textDecoration: forms[2].check ? "line-through" : "none",
                }}
                clickHandler={() => {
                  setActiveForm(2);
                  setOpen(true);
                }}
                linkText="Create a Delivery Area"
                icon={forms[2].check ? <CheckIcon /> : <WarningIcon />}
                withArrow={!forms[2].check}
              />
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <SetupGuideCard
            cardNumber="3"
            title="Inventory of assets"
            description="Easily create a list of your office assets and give users access to benefit from them."
            formLink={
              <LinkButton
                disabled={forms[3].check}
                sx={{
                  color: forms[3].check ? "#55585C" : "#074EE8",
                  cursor: forms[3].check ? "auto" : "pointer",
                  textDecoration: forms[3].check ? "line-through" : "none",
                }}
                clickHandler={() => {
                  setActiveForm(3);
                  setOpen(true);
                }}
                linkText="Add Asset"
                icon={forms[3].check ? <CheckIcon /> : <WarningIcon />}
                withArrow={!forms[3].check}
              />
            }
          />
        </Grid>
      </Grid>

      {forms.map((item, index) => {
        return (
          open &&
          activeForm === index && (
            <OpenForm
              key={index}
              form={item.form}
              openForm={() => {
                setOpen(true);
              }}
              closeForm={handleClose}
              formSize={{
                width: item.formSize.width,
              }}
            />
          )
        );
      })}
    </Box>
  );
}

function OpenForm({
  form,
  openForm,
  closeForm,
  formSize,
}: {
  form?: any;
  openForm?: any;
  closeForm?: any;
  formSize?: { height?: number; width?: number };
}) {
  return (
    <Dialog
      open={openForm}
      onClose={closeForm}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: formSize?.width,
          minWidth: formSize?.width,
          width: formSize?.width,
          height: "unset" ?? formSize?.height,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>{form}</DialogContent>
    </Dialog>
  );
}
