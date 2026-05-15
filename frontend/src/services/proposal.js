import api from "./api";

export const createProposal = (jobId, message, price) =>
    api.post("/proposals/", {
        job: jobId,
        message: message,
        price: price,
    })