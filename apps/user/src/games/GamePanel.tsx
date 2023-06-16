import useGameStore, { VoucherStringDate } from "./useGameStore";
import { Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { VoucherGenerateBody } from "database/schema/vouchers";
import { generateCampaignVoucher } from "api-client";
import { useState } from "react";
import useUserAuth from "@/hooks/useUserAuth";
import { Voucher } from "database";
const expVoucher = {
  campaignId: 2,
  couponCode: "RJ5S8E3E6Y",
  createdAt: "2023-06-16T14:30:56.818Z",
  discountType: "FIXED",
  discountValue: 20000,
  expiredAt: "2023-06-30T06:08:56.000Z",
  id: 8,
  maxDiscount: 20,
  updatedAt: "2023-06-16T14:30:56.818Z",
  userId: 4,
};
const GamePanel = () => {
  const gameState = useGameStore();
  const highScore = gameState.gameName
    ? gameState.bestScores[gameState.gameName]
    : undefined;
  const generateVoucherMutation = useMutation({
    mutationFn: async (body: VoucherGenerateBody) =>
      gameState.campaign
        ? await generateCampaignVoucher(gameState.campaign.id, body)
        : null,
    onSuccess: (data) => {
      if (data) {
        if (gameState.gameName) gameState.resetBestScore(gameState.gameName);
        gameState.setVoucherInfo(data as VoucherStringDate);
        // message.success("Voucher generated successfully");
      }
    },
  });
  const currentGame = gameState.games
    ? gameState.games.find((game) => game.slug === gameState.gameName)
    : undefined;
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
  const { user } = useUserAuth();

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
  return !gameState.gameStarted || gameState.gameOver ? (
    <div className="absolute top-0 z-10 flex flex-col items-center justify-center w-full h-full rounded-md bg-gray-950/30">
      {!gameState.gameOver ? (
        <div className="flex flex-col items-center p-6 text-white rounded-lg w-80">
          <div className="mb-2 text-3xl font-bold">
            {currentGame && currentGame.name}
          </div>
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
      ) : (
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
      )}
    </div>
  ) : null;
};
export default GamePanel;
