// contexts & globals
import i18next from 'i18next'
import AuthPageLayout from "./AuthPageLayout";

// react & next
import React from "react";
import { useRouter } from "next/router";

// orangery elements & internal dependencies
import OfficeForm from "../dashboard/_components/officeSelect/OfficeForm";

export default function CompanyInformationForm() {
  const router = useRouter();

  return (
    <AuthPageLayout
      title={i18next.t("companyInformation.Tell us about your company", { ns: "auth" })}
      image={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/CompanyInformation.svg`}
      bottomLabel={<>
      </>
      }
    >
      <OfficeForm
        submitButtonText={i18next.t("companyInformation.Create Account", { ns: "auth" })}
        onSubmit={() => { router.push("/dashboard"); }}
        spaceBetween={true}
      />
    </AuthPageLayout >
  );
}
