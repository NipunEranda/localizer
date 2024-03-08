import axios from "axios";
import { ObjectId } from "mongodb";

export class User {
  _id: ObjectId;
  avatar_url: string;
  bio: string;
  company: string;
  created_at: string;
  email: string;
  followers: number;
  following: number;
  html_url: string;
  id: number;
  location: string;
  login: string;
  name: string;
  public_repos: number;
  type: string;

  static createUser(user: User) {
    return user;
  }
}

const getUserDetails = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user`,
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true
      }
    );
    const user = User.createUser(response.data);
    return response ? user : null;
  } catch (e) {
    return e;
  }
};

const getUserEmail = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user/emails`,
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true
      }
    );
    return response
      ? response.data.filter((email: { [x: string]: any; }) => email["primary"])[0]
      : null;
  } catch (e) {
    return e;
  }
};

// const getOrganizations = async (token: string) => {
//   let response = null;
//   try {
//     response = await axios.get(
//       `${process.env.VUE_APP_GITHUB_API_URL}/user/orgs`,
//       {
//         headers: {
//           Authorization: "Bearer " + token,
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );
//     return response ? response["data"] : null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// const getOrgRepositories = async (org: number, token: string) => {
//   let response = null;
//   try {
//     response = await axios.get(
//       `${process.env.VUE_APP_GITHUB_API_URL}/orgs/${org}/repos`,
//       {
//         headers: {
//           Authorization: "Bearer " + token,
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );
//     return response ? response["data"] : null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// const getPersonalRepositories = async (token: string) => {
//   let response = null;
//   try {
//     response = await axios.get(
//       `${process.env.VUE_APP_GITHUB_API_URL}/user/repos?visibility=all&per_page=100`,
//       {
//         headers: {
//           Authorization: "Bearer " + token,
//           Accept: "application/vnd.github.v3+json",
//         },
//       }
//     );
//     return response ? response["data"] : null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// const getLanguagesInRepository = async (link: string, token: string) => {
//   let response = null;
//   try {
//     response = await axios.get(link, {
//       headers: {
//         Authorization: "Bearer " + token,
//         Accept: "application/vnd.github.v3+json",
//       },
//     });
//     return response ? response["data"] : null;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

export default {
  getUserDetails,
  getUserEmail,
  // getOrganizations,
  // getOrgRepositories,
  // getPersonalRepositories,
  // getLanguagesInRepository,
};
