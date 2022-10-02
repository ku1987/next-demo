// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import {
  OAUTH_REDIRECT_URL,
  GOOGLE_OAUTH_TOKEN_ENDPOINT,
  GOOGLE_USERINFO_ENDPOINT,
} from "../../constants";

type AuthResult = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

const requestToken = async (code: string): Promise<AuthResult> => {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("client_id", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "");
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "");
  params.append("redirectUri", OAUTH_REDIRECT_URL);
  params.append("grant_type", "authorization_code");
  try {
    const res = await axios.post(GOOGLE_OAUTH_TOKEN_ENDPOINT, params);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getUserInfo = async (accessToken: string): Promise<any> => {
  const config = {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  };
  const res = await axios.get(GOOGLE_USERINFO_ENDPOINT, config);
  return res.data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: AxiosResponse<AuthResult> }>
) {
  const { code } = <{ code: string }>req.query;
  try {
    const data = await requestToken(code);
    const userInfo = await getUserInfo(data.access_token);
    console.log({ userInfo });

    res.status(200).json({ data: userInfo });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
