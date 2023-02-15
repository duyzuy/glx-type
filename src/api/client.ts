interface Options {
  body?: object;
  headers?: object;
  method: string;
}

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

  const baseUrl = `${apiUrl}"/"${input}`;

  const response = await fetch(baseUrl, { ...configs });

  if (response.status !== 200) {
    throw new Error(`recieved a bad status code [${response.status}]`);
  }

  return {
    status: response.status,
    data: response.json(),
    headers: response.headers,
  };
};

client.get = async (input: string) => {
  return await client(input, { method: "GET" });
};
client.post = (input: string, { body = {}, headers = {}, method = "POST" }) => {
  return client(input, { body, headers, method });
};
export default client;
