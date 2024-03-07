import axios from "axios";

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

const getUserEmail = async (token: string) => {
  let response: Object = {};
  try {
    response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user/emails`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    return response ? response["data"].filter((email: String) => email.primary)[0] : null;
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

export default {
  getUserDetails,
  getUserEmail,
  getOrganizations,
  getOrgRepositories,
  getPersonalRepositories,
  getLanguagesInRepository,
};
