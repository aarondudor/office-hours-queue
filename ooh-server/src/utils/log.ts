export default function log(
  method: string,
  route: string,
  reqBody: object,
  resBody: object
) {
  console.log(
    `${new Date().toLocaleTimeString()}: ${method} ${route} ${JSON.stringify(
      reqBody
    )} -> ${JSON.stringify(resBody)}`
  );
}
