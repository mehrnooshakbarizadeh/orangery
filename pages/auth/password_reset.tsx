// contexts & globals
import AuthScaffold from "../../src/components/auth/AuthScaffold";

// react & next
import type { NextPage } from "next";
import Head from "next/head";

// orangery elements & internal dependencies
import PasswordResetForm from "../../src/components/auth/PasswordResetForm";

const PasswordReset: NextPage = () => {
  return (<>
    <Head>
      <title>orangeryOS</title>
      <meta name="description" content="orangeryOS" />
    </Head>

    <AuthScaffold>
      <PasswordResetForm />
    </AuthScaffold>
  </>
  );
};

export default PasswordReset;
