import middy from "middy";
import {
  AppResponse,
  _Response,
  connectMongoose,
  closeMongooseConnection,
} from "./util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { verifyToken } from "./auth";
import { _File, _FileLine, fileSchema } from "./models/File";
import { event } from "jquery";
import axios from "axios";
import cookie from "cookie";
import { xml2json } from "xml-js";
import { _Language } from "./models/Language.ts";

export const getFiles = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    // Get user workspaces
    const files = await fileSchema.find({
      workspace: event.queryStringParameters?.workspace,
      owner: event.queryStringParameters!.userId,
      deleted: false,
    });
    return AppResponse.createObject(200, files, null);
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const addFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    if (event.body) {
      const file: _File = JSON.parse(event.body);
      await fileSchema.create(file);

      event.queryStringParameters!.workspace = file.workspace;
      return AppResponse.createObject(
        200,
        JSON.parse((await getFiles(event)).body!).data,
        null
      );
    } else {
      return AppResponse.createObject(400, null, "Missing Data!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const updateFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    if (event.body) {
      const file: _File = JSON.parse(event.body);

      await fileSchema.updateOne(
        { _id: file._id },
        {
          $set: {
            name: file.name,
            branch: file.branch,
            versionId: file.versionId,
            type: file.type,
            from: file.from,
            to: file.to,
            lines: file.lines,
            modifiedOn: new Date(),
            modifiedBy: file.modifiedBy,
            fileUrl: file.fileUrl,
            history: file.history,
          },
        }
      );
      event.queryStringParameters!.workspace = file.workspace;
      return AppResponse.createObject(
        200,
        JSON.parse((await getFiles(event)).body!).data,
        null
      );
    } else {
      return AppResponse.createObject(400, null, "Missing Data!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const removeFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    await fileSchema.updateOne(
      { _id: event.queryStringParameters!.id },
      { $set: { deleted: true } }
    );
    return AppResponse.createObject(
      200,
      JSON.parse((await getFiles(event)).body!).data,
      null
    );
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const getGithubContent = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  let jsonArray: _FileLine[] = [];
  let xml = "";
  let response: { content: String } = { content: "" };
  let url: string = "";
  try {
    await connectMongoose();

    const cookies = cookie.parse(event.headers.cookie!);
    const file = await fileSchema.findOne({
      _id: event.queryStringParameters!.id,
    });

    if (file) {
      if (file?.branch.includes("/")) {
      } else {
        url = `https://api.github.com/repos/${file.fileUrl.split("/")[3]}/${
          file.fileUrl.split("/")[4]
        }/contents/${file.name}?ref=${file.branch}`;
      }
    }

    response = (
      await axios.get(url, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
        },
      })
    ).data;

    // Split keys and values
    if (response.content) {
      response.content = Buffer.from(response!.content, "base64")
        .toString()
        .trim();

      let key: string = "";
      if (file?.type === "C#") {
        response.content.split(/\r?\n/).forEach((element) => {
          xml += element;
        });
        let convertedArray = JSON.parse(
          xml2json(xml, { compact: true, spaces: 4 })
        ).root.data;
        jsonArray = convertedArray.map(
          (item) =>
            (item = {
              name: item._attributes.name,
              value: item.value._text,
              translation: { id: 0, value: "", language: 0 },
            })
        );
      } else if (file?.type == "Javascript") {
        response.content.split(/\r?\n/).forEach((line) => {
          if (!(line.includes("export") || line.includes(" }"))) {
            if (line.includes(": {")) {
              key = line.split(":")[0];
            } else {
              if (typeof line == "string" && !(line == "}" || line == "};")) {
                jsonArray.push({
                  name: `${key.trim()}.${line.split(":")[0].trim()}`,
                  value: line
                    .split(":")[1]
                    .slice(0, -1)
                    .replace(/'/g, "")
                    .replace(/"/g, "")
                    .replace(/\\/g, '\\"'),
                  translation: { value: "", language: "" },
                  history: [],
                });
              }
            }
          }
        });
      } else if (file?.type == "Java") {
        response.content.split(/\r?\n/).forEach((line) => {
          if (file.type === "Java") {
            line.split("")[0] == "#" || line === ""
              ? null
              : jsonArray.push({
                  name: line.split("=")[0].trim(),
                  value: line.split("=")[1].replace(/\\/g, '\\"').trim(),
                  translation: { value: "", language: "" },
                  history: [],
                });
          }
          //  else {
          //   if (
          //     !(
          //       line.includes("/*") ||
          //       line.includes("//") ||
          //       line.includes("*/") ||
          //       line == "" ||
          //       line.split("")[0] == "#" ||
          //       line.includes("{") ||
          //       line.includes("}") ||
          //       line.includes("resource StringTable")
          //     )
          //   ) {
          //     jsonArray.push({
          //       name: line.split(",")[0].trim(),
          //       value: line
          //         .split(",")[1]
          //         .replace(/"/g, "")
          //         .replace(/\\/g, '\\"'),
          //       translation: { id: 0, value: "", language: 0 },
          //     });
          //   }
          // }
        });
      }
    }

    jsonArray = jsonArray.sort((a, b) => a.name.localeCompare(b.name));

    if (response.content) return AppResponse.createObject(200, jsonArray, null);
    else return AppResponse.createObject(200, null, null);
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const translate = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  const translate = require("@iamtraction/google-translate");
  try {
    const translateRequestBody: {
      name: string;
      value: string;
      from: _Language;
      to: _Language;
    } = JSON.parse(event.body!);
    const response = await translate(translateRequestBody.value, {
      from: translateRequestBody.from.code.toLowerCase(),
      to: translateRequestBody.to.code.toLowerCase(),
    });

    if (response.text)
      return AppResponse.createObject(200, response.text, null);
    return AppResponse.createObject(
      400,
      null,
      "Something went wrong in translation"
    );
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const responseHandler = async function (
  event: APIGatewayProxyEvent,
  context: Context
) {
  try {
    let result: AppResponse | null;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "GET"
    ) {
      result = await getFiles(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file/content` &&
      event.httpMethod == "GET"
    ) {
      result = await getGithubContent(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "POST"
    ) {
      result = await addFile(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file/translate` &&
      event.httpMethod == "POST"
    ) {
      result = await translate(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "DELETE"
    ) {
      result = await removeFile(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "PUT"
    ) {
      result = await updateFile(event);
    } else {
      return AppResponse.createObject(404, null, "Path doesn't exists");
    }
    if (result) return result;
    else {
      return AppResponse.createObject(
        500,
        null,
        "Unable to response to request!"
      );
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(e.statusCode, e, e.message);
  }
};

export const handler = middy(responseHandler).use(verifyToken());
