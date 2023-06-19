import { Employee } from "database";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface AdminState {
  employee: Employee | null;
  setEmployee: (employee: Employee | null) => void;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  logout: (() => void) | null;
  setLogout: (logout: (() => void) | null) => void;
}
const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      employee: null,
      setEmployee: (employee) => set({ employee }),
      authenticated: false,
      setAuthenticated: (authenticated) => set({ authenticated }),
      logout: null,
      setLogout: (logout) => set({ logout }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        authenticated: state.authenticated,
        employee: state.employee,
      }),
    }
  )
);

export default useAdminStore;
