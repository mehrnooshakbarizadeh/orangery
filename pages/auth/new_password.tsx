// contexts & globals
import AuthScaffold from "../../src/components/auth/AuthScaffold";

// react & next
import type { NextPage } from "next";
import Head from "next/head";

// orangery elements & internal dependencies
import SetNewPasswordForm from "../../src/components/auth/SetNewPasswordForm";

const NewPassword: NextPage = () => {
  return (<>
    <Head>
      <title>orangeryOS</title>
      <meta name="description" content="orangeryOS" />
    </Head>

    <AuthScaffold>
      <SetNewPasswordForm />
    </AuthScaffold>
  </>
  );
};

export default NewPassword;
