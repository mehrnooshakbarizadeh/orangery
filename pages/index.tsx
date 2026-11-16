// react & next
import React, { useEffect, useState } from "react";
import Router from 'next/router'

// orangery elements & internal dependencies
import { OrangeryNavigationContentLoader } from "../src/components/OrangeryElements";

const Home = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const { pathname } = Router

    if (pathname == '/') {
      // Router.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/login`)
      Router.push(`/auth/login`)
    } else {
      setLoaded(true)
    }
  }, []);

  if (!loaded) {
    return <OrangeryNavigationContentLoader /> //show nothing or a loader
  }
  return (
    <p>
      You will see this page in wrong url rewriting, <br />
    </p>
  )
}
export default Home