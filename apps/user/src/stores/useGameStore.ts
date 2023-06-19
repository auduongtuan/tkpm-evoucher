import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Game, Voucher, DetailCampaign } from "database";
export type GameSlug = "FLAPPY_BIRD" | "2048" | "SNAKE";
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
  gameSlug: GameSlug | null;
  setGameSlug: (gameSlug: GameSlug) => void;
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
  resetBestScore: (gameSlug: GameSlug) => void;
  setBestScore: (gameSlug: GameSlug, score: number) => void;
  bestScores: {
    [key in GameSlug]?: number;
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
      gameSlug: null,
      setGameSlug: (gameSlug) => set({ gameSlug: gameSlug }),
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
      resetBestScore: (gameSlug) =>
        set((state) => ({
          bestScores: { ...state.bestScores, [gameSlug]: 0 },
        })),
      setBestScore: (gameSlug, score) =>
        set((state) => {
          if (
            !(gameSlug in state.bestScores) ||
            score > (state.bestScores[gameSlug] as number)
          ) {
            console.log(state.bestScores[gameSlug]);
            return { bestScores: { ...state.bestScores, [gameSlug]: score } };
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
