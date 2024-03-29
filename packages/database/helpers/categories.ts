import {
  CategoriesOnStores,
  Category,
  Merchant,
  Employee,
  Campaign,
  Store,
} from "@prisma/client";
export function simplifyCategories(
  categories: (CategoriesOnStores & { category: Category })[]
) {
  return categories.map((category) => category.category);
}

type FullQueriedMerchant =
  | (Merchant & {
      employees: Employee[];
      stores: (Store & {
        categories: (CategoriesOnStores & {
          category: Category;
        })[];
      })[];
      campaigns: Campaign[];
    })
  | null;
export function simplifyMerchant(merchant: FullQueriedMerchant) {
  return merchant
    ? {
        ...merchant,
        stores: merchant.stores.map((store) => ({
          ...store,
          categories: simplifyCategories(store.categories),
        })),
      }
    : null;
}
