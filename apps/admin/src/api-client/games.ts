import { GameCreateBody, GameUpdateBody } from "../../../api/schema/games";
import { Game } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/games",
});
export async function getGames(): Promise<Game[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getGame(id: string | number): Promise<Game> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createGame(body: GameCreateBody): Promise<Game> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateGame(
  id: number,
  body: GameUpdateBody
): Promise<Game> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteGame(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
