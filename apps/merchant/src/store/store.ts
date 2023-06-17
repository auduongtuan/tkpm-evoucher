import { create } from "zustand";
interface AuthenticationState {
  token: string;
  setToken: (token: string) => void;
}

const useAuthenticationStore = create<AuthenticationState>((set) => ({
  token: "",
  setToken: (token) => set(() => ({ token: token })),
}));

export default useAuthenticationStore;
