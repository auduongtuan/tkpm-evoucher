import { create } from "zustand";
interface MerchantState {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
}

const useMerchantStore = create<MerchantState>((set) => ({
  createModalOpen: false,
  setCreateModalOpen: (open) => set(() => ({ createModalOpen: open })),
}));

export default useMerchantStore;
