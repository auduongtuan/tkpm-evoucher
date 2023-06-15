import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GameName = "FLAPPY_BIRD" | "2048";
interface GameState {
  modalOpen: boolean;
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
  setBestScore: (gameName: GameName, score: number) => void;
  bestScores: {
    [key in GameName]?: number;
  };
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
      modalOpen: false,
      gameOver: false,
      gameName: null,
      setGameName: (gameName) => set({ gameName }),
      gameStarted: false,
      setGameOver: (gameOver) => set({ gameOver }),
      setGameStarted: (gameStarted) => set({ gameStarted }),
      resetGame: () => set({ gameOver: false, gameStarted: true }),
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      score: 0,
      setScore: (score) => set({ score }),
      bestScores: {},
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
    }),
    {
      name: "game-storage", // name of item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ bestScores: state.bestScores }),
    }
  )
);

export default useGameStore;