import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Game, Voucher, DetailCampaign } from "database";
export type GameName = "FLAPPY_BIRD" | "2048" | "SNAKE";
export type VoucherStringDate = Omit<
  Voucher,
  "createdAt" | "expiredAt" | "updatedAt"
> & {
  createdAt: string;
  expiredAt: string;
  updatedAt: string;
};
interface GameState {
  modalOpen: boolean;
  games: Game[];
  setGames: (games: Game[]) => void;
  gameName: GameName | null;
  setGameName: (gameName: GameName) => void;
  openModal: () => void;
  closeModal: () => void;
  score: number;
  setScore: (score: number) => void;
  gameOver: boolean;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  resetGame: () => void;
  restartGame: () => void;
  resetBestScore: (gameName: GameName) => void;
  setBestScore: (gameName: GameName, score: number) => void;
  bestScores: {
    [key in GameName]?: number;
  };
  voucherInfo: VoucherStringDate | null;
  setVoucherInfo: (voucherInfo: VoucherStringDate | null) => void;
  campaign: DetailCampaign | null;
  setCampaign: (campaign: DetailCampaign) => void;
}
// const getBestScoresFromLocalStorage = () => {
//   try {
//     return JSON.parse(localStorage.getItem("bestScores") || "{}");
//   } catch {
//     return {};
//   }
// };
const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      games: [],
      setGames: (games) => set({ games }),
      modalOpen: false,
      gameOver: false,
      gameName: null,
      setGameName: (gameName) => set({ gameName }),
      gameStarted: false,
      setGameOver: (gameOver) => set({ gameOver }),
      setGameStarted: (gameStarted) => set({ gameStarted }),
      resetGame: () => set({ gameOver: false, gameStarted: false }),
      restartGame: () => set({ gameOver: false, gameStarted: true }),
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      score: 0,
      setScore: (score) => set({ score }),
      bestScores: {},
      resetBestScore: (gameName) =>
        set((state) => ({
          bestScores: { ...state.bestScores, [gameName]: 0 },
        })),
      setBestScore: (gameName, score) =>
        set((state) => {
          if (
            !(gameName in state.bestScores) ||
            score > (state.bestScores[gameName] as number)
          ) {
            console.log(state.bestScores[gameName]);
            return { bestScores: { ...state.bestScores, [gameName]: score } };
          } else {
            return {};
          }
        }),
      voucherInfo: null,
      setVoucherInfo: (voucherInfo) => set({ voucherInfo }),
      campaign: null,
      setCampaign: (campaign) => set({ campaign }),
    }),
    {
      name: "game-storage", // name of item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ bestScores: state.bestScores }),
    }
  )
);

export default useGameStore;
