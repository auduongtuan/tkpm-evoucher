import {
  CampaignCreateBody,
  CampaignUpdateBody,
  CampaignsParamsType,
} from "database/schema/campaigns";
import { Campaign, Game, Store, Merchant } from "database";
import { createInstance } from "./base";
import { VoucherGenerateBody } from "database/schema/vouchers";
const instance = createInstance("campaigns");
export type DetailCampaign = Campaign & {
  merchant: Merchant;
  stores: Store[];
  games: Game[];
};

export async function getCampaigns(
  params?: CampaignsParamsType
): Promise<DetailCampaign[]> {
  const res = await instance.get("/", { params });

  return res.data;
}

export async function getCampaign(
  id: string | number
): Promise<DetailCampaign> {
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

export async function generateCampaignVoucher(
  id: number,
  body: VoucherGenerateBody
) {
  const res = await instance.post(`/${id}/generate-voucher`, {
    ...body,
  });
  return res.data;
}
