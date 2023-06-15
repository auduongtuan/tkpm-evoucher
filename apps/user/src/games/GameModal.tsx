import { Modal } from "antd";
import Game from "./FlappyBird/Game";
import useGameStore from "./useGameStore";
import { Button, message } from "antd";
import { useEffect, useReducer } from "react";
import { useMutation } from "@tanstack/react-query";
import { VoucherGenerateBody } from "../../../api/schema/vouchers";
import { generateCampaignVoucher } from "api-client";
import useUserAuth from "@/hooks/useUserAuth";
const GameModal = ({ campaignId }: { campaignId: number }) => {
  const gameState = useGameStore();
  const [lastUpdate, refresh] = useReducer(() => Date.now(), Date.now());

  useEffect(() => {
    gameState.setGameName("FLAPPY_BIRD");
  }, []);
  const { user } = useUserAuth();
  const highScore = gameState.gameName
    ? gameState.bestScores[gameState.gameName]
    : undefined;
  const generateVoucherMutation = useMutation({
    mutationFn: async (body: VoucherGenerateBody) =>
      await generateCampaignVoucher(campaignId, body),
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        if (gameState.gameName) gameState.resetBestScore(gameState.gameName);
        message.success("Voucher generated successfully");
      }
    },
  });
  const generateVoucher = () => {
    if (user && highScore) {
      generateVoucherMutation.mutate({
        userId: user.id,
        score: highScore,
      });
    } else {
      message.error("Login credentials not found or score not found");
    }
  };
  const cta = () => {
    return (
      <div className="flex gap-2 mt-4">
        <Button size="middle" onClick={() => gameState.restartGame()}>
          Retry
        </Button>
        <Button type="primary" size="middle" onClick={() => generateVoucher()}>
          Exchange voucher
        </Button>
      </div>
    );
  };
  return (
    <Modal
      title={"Flappy Bird"}
      open={gameState.modalOpen}
      onCancel={() => {
        gameState.closeModal();
        gameState.resetGame();
      }}
      footer={null}
    >
      <div className="relative">
        {!gameState.gameStarted && (
          <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-gray-950/30">
            <div className="flex flex-col items-center p-6 text-white rounded-lg w-80">
              <div className="mb-2 text-3xl font-bold">Flappy Bird</div>
              {highScore ? (
                <div className="text-xl">Best Score: {highScore}</div>
              ) : null}
              {!highScore ? (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="large"
                    onClick={() => gameState.setGameStarted(true)}
                  >
                    Start
                  </Button>
                </div>
              ) : (
                cta()
              )}
            </div>
          </div>
        )}
        {gameState.gameOver && (
          <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-gray-950/30">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl w-80">
              <div className="mb-2 text-2xl font-bold">Game Over</div>
              <div className="text-lg">Score: {gameState.score}</div>
              {typeof highScore != "undefined" ? (
                <>
                  <div className="text-lg">Best Score: {highScore}</div>
                  {cta()}
                </>
              ) : null}
            </div>
          </div>
        )}
        <Game key={lastUpdate} />
      </div>
    </Modal>
  );
};
export default GameModal;
