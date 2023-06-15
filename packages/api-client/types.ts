import { Store, Category } from "database";
export type StoreWithCategories = Store & { categories: Category[] };
