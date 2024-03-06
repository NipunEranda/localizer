import jwt from "jsonwebtoken";
import middy from "middy";
import { responseHandler } from "./util";
import axios from "axios";

exports.systemLogin = async (event) => {
  if (event.queryStringParameters.code) {
    try {
      // event.queryStringParameters.code
      const response = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${event.queryStringParameters.code}&redirect_uri=${process.env.VUE_APP_GITHUB_REDIRECT_URI}`,
        headers: {
          accept: "application/json",
        },
      });
      const user = await getUserDetails(response.data.access_token);
      return responseHandler(
        200,
        { user: user, token: response.data.access_token },
        "Authentication Success!"
      );
    } catch (e) {
      console.log(e);
      return { statusCode: 200, body: null, message: null };
    }
  }
  return {
    statusCode: 200,
    body: null,
    message: null,
  };
};

const handler = async function (event, context) {
  try {
    var result = null;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/auth/github` &&
      event.httpMethod == "GET"
    ) {
      result = await exports.systemLogin(event);
    }
    return result;
  } catch (e) {
    console.log(e);
    return responseHandler(500 || e.status, e, e.message);
  }
};

const getUserDetails = async (token: string) => {
  let response = null;
  try {
    response = await axios.get(`${process.env.VUE_APP_GITHUB_API_URL}/user`, {
      headers: { Authorization: "Bearer " + token },
    });
    return response ? response["data"] : null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getOrganizations = async (token: string) => {
  let response = null;
  try {
    response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user/orgs`,
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return response ? response["data"] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getOrgRepositories = async (org: number, token: string) => {
  let response = null;
  try {
    response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/orgs/${org}/repos`,
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return response ? response["data"] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPersonalRepositories = async (token: string) => {
  let response = null;
  try {
    response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user/repos?visibility=all&per_page=100`,
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return response ? response["data"] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getLanguagesInRepository = async (link: string, token: string) => {
  let response = null;
  try {
    response = await axios.get(link, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response ? response["data"] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.handler = middy(handler);
