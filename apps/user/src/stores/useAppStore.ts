import { User } from "database";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  // lat, lng
  userCoords: [number, number] | null;
  requestUserCoords: () => void;
}
const useAppStore = create<AppState>(
  persist(
    (set) => ({
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
      userCoords: null,
      requestUserCoords: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            set({
              userCoords: [position.coords.latitude, position.coords.longitude],
            });
          });
        }
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ userCoords: state.userCoords }),
    }
  )
);

export default useAppStore;
