import {
  Campaign,
  Merchant,
  Store,
  Game,
  Category,
  Voucher,
  User,
} from "@prisma/client";
import type { Extended } from "helpers";
export type CampaignStatus = "upcoming" | "ongoing" | "expired";
export type VoucherStatus = "unused" | "used" | "expired";

export type DetailCampaign = Campaign & {
  merchant: Merchant;
  stores: Store[];
  games: Game[];
  status: CampaignStatus;
};
export type DetailStore = Store & {
  categories: Category[];
  campaigns: Campaign[];
  merchant: Merchant;
};
export type StoreWithCategories = Store & { categories: Category[] };
export type ExtendedUser = Extended<User>;

export type DetailVoucher = Voucher & {
  status: VoucherStatus;
};
