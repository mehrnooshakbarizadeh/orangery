// contexts & globals
import AuthScaffold from "../../src/components/auth/AuthScaffold";

// react & next
import type { NextPage } from "next";
import Head from "next/head";

// orangery elements & internal dependencies
import LoginForm from "../../src/components/auth/LoginForm";

const Login: NextPage = () => {
  return (<>
    <Head>
      <title>orangeryOS</title>
      <meta name="description" content="orangeryOS" />
    </Head>

    <AuthScaffold>
      <LoginForm />
    </AuthScaffold>
  </>
  );
};

export default Login;
