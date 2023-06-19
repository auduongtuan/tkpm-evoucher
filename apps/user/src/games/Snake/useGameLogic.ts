import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { SEGMENT_SIZE } from "./SnakeGame";

import { GameState } from "./SnakeGame";
import createSnakeMovement, {
  hasSnakeEatenItself,
  willSnakeHitTheFood,
} from "./movement";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

interface RandomPositionOnGridArgs {
  gridSize?: number;
  threshold: number;
}

const randomPositionOnGrid = ({
  gridSize = 5,
  threshold,
}: RandomPositionOnGridArgs) =>
  Math.floor(Math.random() * (threshold / gridSize)) * gridSize;

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const MOVEMENT_SPEED = 100;

interface UseGameLogicArgs {
  canvasWidth?: number;
  canvasHeight?: number;
  onGameOver: () => void;
  gameState: GameState;
}

const useGameLogic = ({
  canvasHeight,
  canvasWidth,
  onGameOver,
  gameState,
}: UseGameLogicArgs) => {
  const [direction, setDirection] = useState<Direction | undefined>();
  const [snakeBody, setSnakeBody] = useState<Position[]>([
    {
      x: 0,
      y: 0,
    },
  ]);

  const resetGameState = () => {
    setDirection(undefined);
    setFoodPosition({
      x: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasWidth!,
      }),
      y: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasHeight!,
      }),
    });

    setSnakeBody([
      {
        x: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasHeight!,
        }),
      },
    ]);
  };

  const [foodPosition, setFoodPosition] = useState<Position | undefined>();

  const snakeHeadPosition = snakeBody[snakeBody.length - 1];
  const { moveDown, moveUp, moveLeft, moveRight } = createSnakeMovement();

  useEffect(() => {
    if (!canvasHeight || !canvasWidth) {
      return;
    }
    setFoodPosition({
      x: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasWidth,
      }),
      y: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasHeight,
      }),
    });

    setSnakeBody([
      {
        x: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasWidth,
        }),
        y: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasHeight,
        }),
      },
    ]);
  }, [canvasHeight, canvasWidth]);

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.code) {
      case "ArrowDown":
        if (direction !== Direction.UP) {
          setDirection(Direction.DOWN);
        }
        break;
      case "ArrowUp":
        if (direction !== Direction.DOWN) {
          setDirection(Direction.UP);
        }
        break;
      case "ArrowRight":
        if (direction !== Direction.LEFT) {
          setDirection(Direction.RIGHT);
        }
        break;
      case "ArrowLeft":
        if (direction !== Direction.RIGHT) {
          setDirection(Direction.LEFT);
        }
        break;
    }
  };

  const moveSnake = () => {
    console.log("Snake move!!");
    let snakeBodyAfterMovement: Position[] | undefined;
    switch (direction) {
      case Direction.UP:
        if (snakeHeadPosition.y > 0) {
          snakeBodyAfterMovement = moveUp(snakeBody);
        } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
          setDirection(Direction.LEFT);
        } else {
          setDirection(Direction.RIGHT);
        }
        break;
      case Direction.DOWN:
        if (canvasHeight && snakeHeadPosition.y < canvasHeight - SEGMENT_SIZE) {
          snakeBodyAfterMovement = moveDown(snakeBody);
        } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
          setDirection(Direction.LEFT);
        } else {
          setDirection(Direction.RIGHT);
        }

        break;
      case Direction.LEFT:
        if (snakeHeadPosition.x > 0) {
          snakeBodyAfterMovement = moveLeft(snakeBody);
        } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2) {
          setDirection(Direction.DOWN);
        } else {
          setDirection(Direction.UP);
        }
        break;
      case Direction.RIGHT:
        if (canvasWidth && snakeHeadPosition.x < canvasWidth - SEGMENT_SIZE) {
          snakeBodyAfterMovement = moveRight(snakeBody);
        } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2) {
          setDirection(Direction.DOWN);
        } else {
          setDirection(Direction.UP);
        }
        break;
    }

    //snake eats itself
    if (snakeBodyAfterMovement) {
      const isGameOver = hasSnakeEatenItself(snakeBodyAfterMovement);
      if (isGameOver) {
        console.log("game over");
        onGameOver();
      }
    }

    if (
      direction !== undefined &&
      foodPosition &&
      willSnakeHitTheFood({
        foodPosition,
        snakeHeadPosition,
        direction,
      })
    ) {
      setSnakeBody([
        ...snakeBodyAfterMovement!,
        { x: foodPosition.x, y: foodPosition.y },
      ]);

      setFoodPosition({
        x: randomPositionOnGrid({
          threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({ threshold: canvasHeight! }),
      });
    } else if (snakeBodyAfterMovement) {
      setSnakeBody(snakeBodyAfterMovement);
    }
  };

  useInterval(
    moveSnake,
    gameState === GameState.RUNNING ? MOVEMENT_SPEED : null
  );

  return {
    snakeBody,
    onKeyDownHandler,
    foodPosition,
    resetGameState,
  };
};

export default useGameLogic;
