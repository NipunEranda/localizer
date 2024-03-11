import axios from "axios";
import mongoose, { ObjectId } from "mongoose";

export interface _User {
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
  workspaces: string[];
}

export interface UserDocument extends _User, mongoose.Document {
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
  workspaces: string[];
}

const UserSchema = new mongoose.Schema({
  avatar_url: {
    type: String,
    required: false,
    unique: false,
  },
  bio: {
    type: String,
    required: false,
    unique: false,
  },
  company: {
    type: String,
    required: false,
    unique: false,
  },
  created_at: {
    type: String,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  followers: {
    type: Number,
    required: false,
    unique: false,
  },
  following: {
    type: Number,
    required: false,
    unique: false,
  },
  html_url: {
    type: String,
    required: false,
    unique: false,
  },
  id: {
    type: Number,
    required: false,
    unique: false,
  },
  location: {
    type: String,
    required: false,
    unique: false,
  },
  login: {
    type: String,
    required: false,
    unique: false,
  },
  name: {
    type: String,
    required: false,
    unique: false,
  },
  public_repos: {
    type: Number,
    required: false,
    unique: false,
  },
  type: {
    type: String,
    required: false,
    unique: false,
  },
  workspaces: {
    type: Array,
    required: false,
    unique: false,
  },
});

UserSchema.index({ id: 1 });

// Create github user schema
export const userSchema = mongoose.model<_User>("user", UserSchema);

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
