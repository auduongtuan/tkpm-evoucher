import { CampaignsOnStores, Store } from "@prisma/client";
export function simplifyStores(
  stores: (CampaignsOnStores & { store: Store })[]
) {
  return stores.map((store) => store.store);
}
