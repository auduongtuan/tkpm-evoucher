import axios from "axios";
import { Game } from "database";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/games",
});
export async function getGames(): Promise<Game[]> {
  const res = await instance.get("/");

  return res.data;
}
