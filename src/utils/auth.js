const baseUrl =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_API
    : "http://localhost:3001";

const options = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const genericFetch = async (options, endpoint, body) => {
  const fetchOptions = { ...options };
  if (body) fetchOptions.body = JSON.stringify({ ...body });
  const res = await fetch(`${baseUrl}/${endpoint}`, fetchOptions);
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const signup = ({ name, email, password, avatar }) => {
  return genericFetch({ ...options, method: "POST" }, "signup", {
    name,
    email,
    password,
    avatar,
  });
};

export const signin = ({ email, password }) => {
  return genericFetch({ ...options, method: "POST" }, "signin", {
    email,
    password,
  });
};

export const checkAuth = (token) => {
  return genericFetch(
    {
      ...options,
      method: "GET",
      headers: { ...options.headers, authorization: `Bearer ${token}` },
    },
    "users/me"
  );
};
