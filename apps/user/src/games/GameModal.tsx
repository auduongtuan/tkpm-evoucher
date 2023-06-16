import { Divider, Modal } from "antd";
import FlappyBirdGame from "./FlappyBird/FlappyBirdGame";
import useGameStore from "./useGameStore";
import { useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { DetailCampaign, getGames } from "api-client";
import { Game } from "database";
import GamePanel from "./GamePanel";
import SnakeGame from "./Snake/SnakeGame3";
import dayjs from "dayjs";
import Description from "@/components/Description";
import { Button } from "antd";
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
    ? gameState.games.find((game) => game.slug === gameState.gameName)
    : undefined;
  const { campaign, voucherInfo } = gameState;
  const GameComponent =
    currentGame?.slug && currentGame?.slug in GameComponents
      ? GameComponents[currentGame?.slug]
      : null;
  console.log(currentGame?.slug, GameComponent);
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
        <div>
          <p className="mb-2 text-center">You have won a voucher worth</p>
          <p className="mt-1 mb-1 text-3xl font-bold text-center text-blue-600">
            {voucherInfo.discountValue}
            {voucherInfo.discountType == "FIXED" ? " VND" : "%"}
            <br />
          </p>
          <p className="text-xs font-medium text-center text-gray-400 uppercase">
            Up to {voucherInfo.maxDiscount}
            {voucherInfo.discountType == "FIXED" ? "% of bill" : " VND"}
          </p>
          <Divider />
          <div className="flex gap-8 mt-2 mb-4 ">
            <Description label="Valid from" className="grow">
              {dayjs(voucherInfo.createdAt).format("DD/MM/YYYY")}
            </Description>
            <Description label="Valid until" className="grow">
              {dayjs(voucherInfo.expiredAt).format("DD/MM/YYYY")}
            </Description>
          </div>
          <p>
            Use code <strong>{voucherInfo.couponCode}</strong> when using
            services at {campaign.merchant.name} stores, including:
          </p>
          <ul className="pl-2 mt-2 ml-0 list-disc list-inside">
            {campaign.stores.map((store) => (
              <li key={store.id}>{store.name}</li>
            ))}
          </ul>
          <Button
            className="w-full mt-4"
            onClick={() => {
              gameState.setVoucherInfo(null);
              gameState.closeModal();
            }}
          >
            Got it
          </Button>
        </div>
      )}
      {!voucherInfo && (
        <>
          {GameComponent ? (
            <div className="relative overflow-hidden rounded-md">
              <GamePanel />
              <GameComponent key={lastUpdate} />
            </div>
          ) : (
            "Game not available yet"
          )}
        </>
      )}
    </Modal>
  );
};
export default GameModal;
