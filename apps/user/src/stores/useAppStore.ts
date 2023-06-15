import { User } from "database";
import { create } from "zustand";
export interface AppState {
  loginModal: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  registerModal: {
    open: boolean;
    setOpen: (open: boolean) => void;
  };
  user: User | null;
  setUser: (user: User | null) => void;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}
const useAppStore = create<AppState>((set) => ({
  loginModal: {
    open: false,
    setOpen: (open) =>
      set((state) => ({ loginModal: { ...state.loginModal, open } })),
  },
  registerModal: {
    open: false,
    setOpen: (open) =>
      set((state) => ({ registerModal: { ...state.registerModal, open } })),
  },
  user: null,
  setUser: (user) => set({ user }),
  authenticated: false,
  setAuthenticated: (authenticated) => set({ authenticated }),
}));

export default useAppStore;
