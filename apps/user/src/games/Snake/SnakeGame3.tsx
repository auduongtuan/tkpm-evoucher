import React, { useState, useEffect, useRef } from "react";
import useGameStore from "../../stores/useGameStore";
import {
  canvas_size,
  apple_start,
  directions,
  scale,
  snake_start,
  initial_speed,
  direction_start,
} from "./constants";

import useInterval from "@/hooks/useInterval";
export interface ICoords {
  x: number;
  y: number;
}

const createRandomApple = () => {
  return {
    x: Math.floor((Math.random() * canvas_size.x - 10) / scale),
    y: Math.floor((Math.random() * canvas_size.y - 10) / scale),
  };
};
export const maxPoints = 1600;

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState<ICoords>(direction_start);
  const [snake, setSnake] = useState<Array<ICoords>>(snake_start);
  const [apple, setApple] = useState<ICoords>(apple_start);
  const [speed, setSpeed] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // const [isPlaying, gameState.setGameStarted] = useState<boolean>(false);
  const [hasFinishedGame, setHasFinishedGame] = useState<boolean>(false);
  const gameState = useGameStore();
  const startGame = () => {
    setHasFinishedGame(false);
    gameState.setScore(0);
    // gameState.setGameStarted(true);
    setSnake(snake_start);
    setApple(apple_start);
    setDirection(direction_start);
    setSpeed(initial_speed);
    gameState.setGameOver(false);
    wrapperRef.current?.focus();
  };
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      startGame();
    }
  }, [gameState.gameStarted]);
  // update endGame
  const endGame = () => {
    gameState.setGameStarted(false);
    setSpeed(null);
    gameState.setGameOver(true);
  };
  const checkCollision = (piece: ICoords, snoko: ICoords[] = snake) => {
    // Wall Collision Detection
    if (
      piece.x * scale >= canvas_size.x ||
      piece.x < 0 ||
      piece.y * scale >= canvas_size.y ||
      piece.y < 0
    ) {
      return true;
    }
    // Snake Collision Detection
    for (const segment of snoko) {
      if (piece.x === segment.x && piece.y === segment.y) return true;
    }

    return false;
  };

  const checkAppleCollision = (newSnake: ICoords[]) => {
    if (newSnake[0].x === apple.x && newSnake[0].y === apple.y) {
      let newApple = createRandomApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createRandomApple();
      }
      const newScore = gameState.score + 1;
      gameState.setScore(newScore);
      if (gameState.gameName)
        gameState.setBestScore(gameState.gameName, newScore);
      if (gameState.score === maxPoints) {
        setHasFinishedGame(true);
        endGame();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = [...snake]; // Create shallow copy to avoid mutating array
    const newSnakeHead: ICoords = {
      x: snakeCopy[0].x + direction.x,
      y: snakeCopy[0].y + direction.y,
    };
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };
  const moveSnake = (event: React.KeyboardEvent) => {
    const { key } = event;
    // Check if key is arrow key
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowRight" ||
      key === "ArrowLeft"
    ) {
      // disable backwards key, this means no collision when going right, and then pressing ArrowLeft
      if (direction.x + directions[key].x && direction.y + directions[key].y) {
        setDirection(directions[key]);
      }
    }
  };
  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (context == null) throw new Error("Could not get context");
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, canvas_size.x, canvas_size.y);
    // Draw Snake
    context.fillStyle = "#1677ff";
    snake.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));
    // Draw Apple
    context.fillStyle = "#ea7676";
    // context.fillRect(apple.x, apple.y, 1, 1);
    context.beginPath();
    context.arc(apple.x + 0.5, apple.y + 0.5, 0.5, 0, 2 * Math.PI);
    context.fill();
  }, [snake, apple]);
  useInterval(() => gameLoop(), speed);

  return (
    <div className="wrapper">
      <div
        ref={wrapperRef}
        className="w-full canvas leading-[0] focus:outline-0"
        role="button"
        tabIndex={0}
        onKeyDown={(event: React.KeyboardEvent) => moveSnake(event)}
      >
        <canvas
          className="w-full bg-gray-900 rounded-md"
          ref={canvasRef}
          width={canvas_size.x}
          height={canvas_size.y}
        />
        {/* {gameState.gameOver && <div className="game-over">Game Over</div>}
        {!gameState.gameStarted && (
          <button className="start" onClick={startGame}>
            Start Game
          </button>
        )} */}
      </div>
    </div>
  );
};
export default SnakeGame;
