import { Modal, Empty } from "antd";
import FlappyBirdGame from "./FlappyBird/FlappyBirdGame";
import useGameStore from "../stores/useGameStore";
import { useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "api-client";
import { Game } from "database";
import GamePanel from "./GamePanel";
import SnakeGame from "./Snake/SnakeGame3";

import GeneratedVoucherInfo from "./GeneratedVoucherInfo";
const GameComponents = {
  FLAPPY_BIRD: FlappyBirdGame,
  SNAKE: SnakeGame,
};
const GameModal = () => {
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
    ? gameState.games.find((game) => game.slug === gameState.gameSlug)
    : undefined;
  const { campaign, voucherInfo } = gameState;
  const GameComponent =
    currentGame?.slug && currentGame?.slug in GameComponents
      ? GameComponents[currentGame?.slug]
      : null;
  return (
    <Modal
      title={voucherInfo ? "Congratulations!" : currentGame?.name}
      open={gameState.modalOpen}
      onCancel={() => {
        gameState.closeModal();
        gameState.resetGame();
        gameState.setVoucherInfo(null);
      }}
      footer={null}
    >
      {voucherInfo && campaign && (
        <GeneratedVoucherInfo voucherInfo={voucherInfo} campaign={campaign} />
      )}
      {!voucherInfo && (
        <>
          {GameComponent ? (
            <div className="relative overflow-hidden rounded-md">
              <GamePanel />
              <GameComponent key={lastUpdate} />
            </div>
          ) : (
            <Empty description="Game not available yet" />
          )}
        </>
      )}
    </Modal>
  );
};
export default GameModal;
