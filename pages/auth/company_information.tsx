// contexts & globals
import AuthScaffold from "../../src/components/auth/AuthScaffold";

// react & next
import type { NextPage } from "next";
import Head from "next/head";

// orangery elements & internal dependencies
import CompanyInformationForm from "../../src/components/auth/CompanyInformationForm"

const CompanyInformation: NextPage = () => {
  return (<>
    <Head>
      <title>orangeryOS</title>
      <meta name="description" content="orangeryOS" />
    </Head>

    <AuthScaffold>
      <CompanyInformationForm />
    </AuthScaffold>
  </>
  );
};

export default CompanyInformation;
