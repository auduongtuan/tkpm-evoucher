import axios from "axios";
import { Campaign } from "database";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/campaigns",
});
export async function getCampaigns(): Promise<Campaign[]> {
  const res = await instance.get("/");

  return res.data;
}
