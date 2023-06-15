import { Modal } from "antd";
import Game from "./FlappyBird/Game";
import useGameStore from "./useGameStore";
import { Button } from "antd";
import { useEffect } from "react";
const GameModal = () => {
  const gameState = useGameStore();
  useEffect(() => {
    gameState.setGameName("FLAPPY_BIRD");
  }, []);
  return (
    <Modal
      title={"Flappy Bird"}
      open={gameState.modalOpen}
      onCancel={gameState.closeModal}
      footer={null}
    >
      <div className="relative">
        {!gameState.gameStarted && (
          <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-gray-950/30">
            <div className="flex flex-col items-center p-6 text-white rounded-lg w-80">
              <div className="text-2xl font-bold">Flappy Bird</div>
              <div className="text-xl">
                Best Score:{" "}
                {gameState.gameName && gameState.bestScores[gameState.gameName]}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => gameState.setGameStarted(true)}>
                  Start
                </Button>
              </div>
            </div>
          </div>
        )}
        {gameState.gameOver && (
          <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-gray-950/30">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl w-80">
              <div className="mb-2 text-2xl font-bold">Game Over</div>
              <div className="text-md">Score:{gameState.score}</div>
              <div className="text-md">
                Best Score:{" "}
                {gameState.gameName && gameState.bestScores[gameState.gameName]}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => gameState.resetGame()}>Retry</Button>
                <Button type="primary">Exchange voucher</Button>
              </div>
            </div>
          </div>
        )}
        <Game />
      </div>
    </Modal>
  );
};
export default GameModal;
