export interface Response{
    statusCode: number;
    body: Object;
    message: string;
}

// const responseHandler = (statusCode: number, data: Object, message: string) => {
//     return {
//       statusCode: statusCode,
//       body: JSON.stringify(data),
//       message: message,
//     };
//   };