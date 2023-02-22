interface Options {
  body?: object;
  headers?: object;
  method: string;
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

const client = async (input: string, { body, headers, method }: Options) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("glx-token-device") || "";

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

  const baseUrl = `${apiUrl}/${input}`;

  const response: Response = await fetch(baseUrl, { ...configs });

  return {
    status: response.status,
    data: await response.json(),
    headers: response.headers,
  };
};

client.get = async (input: string, { headers = {} } = {}) => {
  return await client(input, { method: "GET", headers });
};
client.post = (input: string, { body = {}, headers = {} }) => {
  return client(input, { body, headers, method: "POST" });
};
export default client;
