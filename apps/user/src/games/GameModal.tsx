import { Modal } from "antd";
import FlappyBirdGame from "./FlappyBird/FlappyBirdGame";
import useGameStore from "./useGameStore";
import { Button, message } from "antd";
import { useEffect, useReducer } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { VoucherGenerateBody } from "database/schema/vouchers";
import { generateCampaignVoucher, getGames } from "api-client";
import { Game } from "database";
import useUserAuth from "@/hooks/useUserAuth";
import GamePanel from "./GamePanel";
import SnakeGame from "./Snake/SnakeGame2";
const GameComponents = {
  FLAPPY_BIRD: FlappyBirdGame,
  SNAKE: SnakeGame,
};

const GameModal = ({ campaignId }: { campaignId: number }) => {
  const gameState = useGameStore();
  const [lastUpdate, refresh] = useReducer(() => Date.now(), Date.now());
  const gameQuery = useQuery({
    queryKey: ["game", "list"],
    queryFn: async () => {
      return await getGames();
    },
    onSuccess: (data: Game[]) => {
      gameState.setGames(data);
    },
  });
  const currentGame = gameState.games
    ? gameState.games.find((game) => game.slug === gameState.gameName)
    : undefined;

  const GameComponent =
    currentGame?.slug && currentGame?.slug in GameComponents
      ? GameComponents[currentGame?.slug]
      : null;
  console.log(currentGame?.slug, GameComponent);
  return (
    <Modal
      title={currentGame?.name}
      open={gameState.modalOpen}
      onCancel={() => {
        gameState.closeModal();
        gameState.resetGame();
      }}
      footer={null}
    >
      {GameComponent ? (
        <div className="relative overflow-hidden rounded-md">
          <GamePanel campaignId={campaignId} />
          <GameComponent key={lastUpdate} />
        </div>
      ) : (
        "Game not available yet"
      )}
    </Modal>
  );
};
export default GameModal;
