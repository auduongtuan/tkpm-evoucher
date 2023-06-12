import { CampaignCreateBody, CampaignUpdateBody } from "api/schema/campaigns";
import { Campaign, Game, Store, Merchant } from "database";
import { createInstance } from "./base";
const instance = createInstance("campaigns");
type CampainSelect = Campaign & {
  merchant: Merchant;
  stores: Store[];
  games: Game[];
};
export async function getCampaigns(): Promise<CampainSelect[]> {
  const res = await instance.get("/");

  return res.data;
}

export async function getCampaign(id: string | number): Promise<CampainSelect> {
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
