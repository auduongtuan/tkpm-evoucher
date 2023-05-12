import {
  CampaignCreateBody,
  CampaignUpdateBody,
} from "../../../api/schema/campaigns";
import { Campaign } from "database";
import axios from "axios";
import { END_POINT } from "./constants";
const instance = axios.create({
  baseURL: END_POINT + "/campaigns",
});
export async function getCampaigns(): Promise<Campaign[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getCampaign(id: string | number): Promise<Campaign> {
  const res = await instance.get(`/${id}`);
  return res.data;
}

export async function createCampaign(
  body: CampaignCreateBody
): Promise<Campaign> {
  const res = await instance.post("/", { ...body });

  return res.data;
}

export async function updateCampaign(
  id: number,
  body: CampaignUpdateBody
): Promise<Campaign> {
  const res = await instance.put(`/${id}`, { ...body });

  return res.data;
}

export async function deleteCampaign(id: number) {
  const res = await instance.delete(`/${id}`);
  return res.data;
}
