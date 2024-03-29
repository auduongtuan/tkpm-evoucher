import { ExcludePassword } from "./../helpers/password";
import {
  Campaign,
  Merchant,
  Store,
  Game,
  Category,
  Voucher,
  User,
  Employee,
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

export type VoucherWithStatus = Voucher & {
  status: VoucherStatus;
};

export type CamapignWithMerchantAndStores = Campaign & {
  merchant: Merchant;
  stores: Store[];
};

export type VoucherWithCampaignAndUser = VoucherWithStatus & {
  campaign: Campaign[];
  user: User;
};

export type DetailVoucher = VoucherWithStatus & {
  campaign: CamapignWithMerchantAndStores;
};

export type UserWithDetailVouchers = ExcludePassword<User> & {
  vouchers: DetailVoucher[];
};

// Merchant
export type CategoryWithStores = Category & { stores: Store[] };

export type FullMerchant = Merchant & {
  stores: StoreWithCategories[];
  employees: Employee[];
  campaigns: Campaign[];
};
