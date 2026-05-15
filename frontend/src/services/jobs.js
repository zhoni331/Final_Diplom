import api from "./api";

export const getMyJobs = () => api.get("/jobs/");
export const createJob = (data) => api.post("/jobs/", data);