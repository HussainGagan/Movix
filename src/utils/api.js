import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzk3ZjQ5MGQ4ZWI2Y2ZhMmE3YTgyM2IxMjZmOTg4ZiIsInN1YiI6IjY0Mzg5ZjcxODFhN2ZjMDBiZTQ1Y2E5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JwDjOiVHOBOFCe-dF0eZXIebg-Fb50RU-0Ed-JyJy-o";

const headers = {
  Authorization: "Bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    return err;
  }
};
