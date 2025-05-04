import axios from "axios";

const api = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

export const fetchLaunches = async (query = {}, limit = 20, page = 1) => {
  const response = await api.post("/launches/query", {
    query,
    options: {
      limit,
      page,
      sort: { date_utc: "desc" },
    },
  });
  return response.data;
};

export const fetchLaunchById = async (id) => {
  const response = await api.get(`/launches/${id}`);
  return response.data;
};

export const fetchRocketById = async (id) => {
  const response = await api.get(`/rockets/${id}`);
  return response.data;
};

export const fetchRockets = async (query = {}, limit = 20, page = 1) => {
  const response = await api.post("/rockets/query", {
    query,
    options: {
      limit,
      page,
      sort: { name: "asc" },
    },
  });
  return response.data;
};
