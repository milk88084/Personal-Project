import axios from "axios";
const KEY = "AIzaSyD0hJya4Hm-YzT9gKDEumESgxl4WnDd_OM";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet",
    maxResults: 5,
    key: KEY,
  },
});
