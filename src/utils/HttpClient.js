import Axios from "axios";

const HttpClient = Axios.create({
  baseURL: process.env.VUE_APP_URL,
  headers: {
    Accept: "application/json",
  },
});
export { HttpClient };
