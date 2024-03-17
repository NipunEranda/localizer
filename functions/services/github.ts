import axios from "axios";
import mongoose, { ObjectId } from "mongoose";
import { _User } from "../models/User";
import cookie from "cookie";
import { APIGatewayProxyEvent } from "aws-lambda";
import { _Branch, _Repository } from "../models/Repository";

const getUserDetails = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_GITHUB_API_URL}/user`,
      {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      }
    );
    const user: _User = response.data;
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
        withCredentials: true,
      }
    );
    return response
      ? response.data.filter(
          (email: { [x: string]: any }) => email["primary"]
        )[0]
      : null;
  } catch (e) {
    return e;
  }
};

const getUserRepositories = async (
  event: APIGatewayProxyEvent
): Promise<_Repository[]> => {
  try {
    const cookies = cookie.parse(
      event.headers.cookie ? event.headers.cookie : ""
    );
    let userRepositories: _Repository[] = [],
      pageCount = 1;
    if (cookies.token && cookies["local._token"]) {
      let repositoryResponse = { data: [] };
      do {
        // Get Repository
        repositoryResponse = await axios.get(
          `https://api.github.com/user/repos?type=all&per_page=100&page=${pageCount}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        userRepositories.push(...repositoryResponse.data);
        ++pageCount;
      } while (repositoryResponse.data.length != 0);
      userRepositories.sort((a, b) => a.name.localeCompare(b.name));
      return userRepositories;
    } else return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getRepositoryBranches = async (
  event: APIGatewayProxyEvent
): Promise<_Branch[]> => {
  try {
    const cookies = cookie.parse(
      event.headers.cookie ? event.headers.cookie : ""
    );
    let branches = [],
      branchResponse = { data: [] };

    // Get branches for the repository
    if (event.queryStringParameters?.repo) {
      let pageCount = 1;
      if (cookies.token && cookies["local._token"]) {
        do {
          branchResponse = await axios.get(
            `https://api.github.com/repos/${event.queryStringParameters?.repo}/branches?per_page=100&page=${pageCount}`,
            {
              headers: {
                Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          );

          branches.push(...branchResponse.data);
          ++pageCount;
        } while (branchResponse.data.length != 0);
      }
      return branches;
    } else return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

// const getUserOrganizations = async (event: APIGatewayProxyEvent) => {
//   try {
//     const cookies = cookie.parse(
//       event.headers.cookie ? event.headers.cookie : ""
//     );
//     if (cookies.token && cookies["local._token"]) {
//       const organizationsResponse = await axios.get(
//         `${process.env.VUE_APP_GITHUB_API_URL}/user/orgs`,
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
//             "X-GitHub-Api-Version": "2022-11-28",
//           },
//         }
//       );
//       return organizationsResponse.data;
//     }
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };

// const getUserOrgRepositories = async (event: APIGatewayProxyEvent) => {
//   try {
//     const cookies = cookie.parse(
//       event.headers.cookie ? event.headers.cookie : ""
//     );
//     let orgRepositories = {};
//     if (cookies.token && cookies["local._token"]) {
//       const orgs = await getUserOrganizations(event);
//       let userOrganizationRepositories = { data: [] },
//         pageCount = 1;
//       await Promise.all(
//         orgs.map(async (org: { id: any }) => {
//           do {
//             userOrganizationRepositories = await axios.get(
//               `${process.env.VUE_APP_GITHUB_API_URL}/orgs/${org.id}/repos?type=all&per_page=100&page=${pageCount}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
//                   "X-GitHub-Api-Version": "2022-11-28",
//                 },
//               }
//             );

//             if (!orgRepositories[org.id]) {
//               orgRepositories[org.id] = { organization: org, repositories: [] };
//             }
//             orgRepositories[org.id]["repositories"].push(
//               ...userOrganizationRepositories.data
//             );
//             ++pageCount;
//             console.log(pageCount);
//           } while (userOrganizationRepositories.data.length != 0);
//         })
//       );
//       return orgRepositories;
//     }
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
  getUserRepositories,
  getRepositoryBranches,
  // getUserOrganizations,
  // getUserOrgRepositories,
  // getOrganizations,
  // getOrgRepositories,
  // getPersonalRepositories,
  // getLanguagesInRepository,
};
