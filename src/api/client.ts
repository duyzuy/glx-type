export interface OptionType {
  body?: object;
  headers?: object;
  method?: string;
  options?: { isHubApi: boolean };
}

// const { fetch: originalFetch } = window;
// //interceptor fetch api
// window.fetch = async (...args) => {
//   let [resource, config] = args;

//   // request interceptor here
//   const response = await originalFetch(resource, config);
//   // response interceptor here
//   return response;
// };

const client = async (
  input: string,
  { body, headers, method, options = { isHubApi: false } }: OptionType
) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiHubUrl = process.env.REACT_APP_API_HUB_URL;
  const token = localStorage.getItem("glx-token-device") || "";
  const { isHubApi } = options;
  let configs: RequestInit = {
    method: method ? method : "POST",
    cache: "no-cache",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "access-token": token,
    },
  };

  if (headers) {
    configs.headers = {
      ...configs.headers,
      ...headers,
    };
  }
  if (body) {
    configs.body = JSON.stringify({ ...body });
  }
  let baseUrl = `${apiUrl}/${input}`;

  if (isHubApi) {
    baseUrl = `${apiHubUrl}/${input}`;
  }

  const response = await fetch(baseUrl, { ...configs });

  return {
    status: response.status,
    data: await response.json(),
    headers: response.headers,
  };
};

client.get = async (
  input: string,
  { headers = {}, options = { isHubApi: false } }: OptionType
) => {
  return await client(input, { method: "GET", headers, options });
};
client.post = (
  input: string,
  { body = {}, headers = {}, options = { isHubApi: false } }: OptionType
) => {
  return client(input, { body, headers, method: "POST", options });
};
export default client;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiIyOGNmZGVkNS1kM2ZhLTQ4YWEtOGYwNy0zMGY3N2RlNTE4M2UiLCJqdGkiOiI0YWFkYWQ1Zi0wYjZmLTQ4OWItOWE4Zi01ZmFkMTcwZWE3MjYiLCJ1aWQiOiI1OTBlMWM0Yy03YmNjLTRlYzYtOGVlNS0zMjVlMGFkMjQzMWYiLCJtaWQiOiJOb25lIiwiZGlkIjoiNzA1OWExMWItODJjNy00YWJiLWE2MzAtYTBkNmY5ZTU0ZTRhIiwicGx0Ijoid2VifHBjfG1hY29zeHwxMF8xNV83fGNocm9tZSIsImlwIjoiMS41NS4zOC4yNDYiLCJ4aWQiOiI2UDE2Nzc1MDkzOTEiLCJhcHBfdmVyc2lvbiI6IjIuMC4wIiwiY2F0IjoiMTY3NzUwOTM5MSIsInRhZ3MiOltdLCJpYXQiOjE2Nzg3MTgwNjcsImV4cCI6MTY3ODgwNDQ2N30._buV4rM6eLOkZfeakst-zYo4p8QZ3svT_Mjh-nx7cTI
