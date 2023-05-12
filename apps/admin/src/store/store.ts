import { create } from "zustand";
interface StoreState {
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
}

const useStoreStore = create<StoreState>((set) => ({
  createModalOpen: false,
  setCreateModalOpen: (open) => set(() => ({ createModalOpen: open })),
}));

export default useStoreStore;
