import axios from "axios";

export const axiosPublic = axios.create({
//   baseURL: "https://apipos.reacts.digital/api", // Correct placement of baseURL
  headers: {
    "Content-Type": "application/json",
  },
});
