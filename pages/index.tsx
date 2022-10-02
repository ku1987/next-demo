import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import {
  GOOGLE_OAUTH_CHOOSE_ACCOUNT_URL,
  OAUTH_REDIRECT_URL,
} from "../constants";

const Home: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const reponseType = "code";
    const scope = "openid email profile";
    const redirectUri = OAUTH_REDIRECT_URL;
    const state = "state";
    const flowName = "GeneralOAuthFlow";
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: reponseType,
      scope,
      redirect_uri: redirectUri,
      state,
      flowName,
    });

    const authPageUrl = `${GOOGLE_OAUTH_CHOOSE_ACCOUNT_URL}?${params.toString()}`;
    router.push(authPageUrl);
    return;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login with Google</title>
        <meta name="description" content="Login with Google" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.description}>Trying to Login with Google...</h1>

        <div className={styles.grid}>
          <button onClick={handleSubmit}>Login with Google</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
