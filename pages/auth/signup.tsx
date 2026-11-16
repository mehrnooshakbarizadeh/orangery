// contexts & globals
import AuthScaffold from "../../src/components/auth/AuthScaffold";
import { useGlobalState } from "../../src/Contexts & Globals/GlobalContext";
import { useTranslation } from "react-i18next";

// react & next
import type { NextPage } from "next";
import Head from "next/head";

// orangery elements & internal dependencies
import SignupForm from "../../src/components/auth/SignupForm";

const Signup: NextPage = () => {
  const { t } = useTranslation();
  const globalState = useGlobalState();

  return (<>
    <Head>
      <title>orangeryOS</title>
      <meta name="description" content="orangeryOS" />
    </Head>

    <AuthScaffold>
      {!globalState.logedIn && <SignupForm />}
    </AuthScaffold>
  </>
  );
};

export default Signup;
