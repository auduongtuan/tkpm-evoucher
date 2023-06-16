import { useEffect, forwardRef, useRef, useState } from "react";
type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
> & {
  draw: (context: CanvasRenderingContext2D) => void;
};
import useGameLogic, { Position } from "./useGameLogic";
import useGameStore from "../useGameStore";
const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ draw, ...props }, canvasRef) => {
    useEffect(() => {
      if (!canvasRef) {
        return;
      }
      const canvas = (canvasRef as React.RefObject<HTMLCanvasElement>).current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      const dpi = window.devicePixelRatio;
      // console.log(dpi);
      // context.scale(dpi, dpi);
      // canvas.width = canvas.clientWidth;
      // canvas.height = canvas.clientHeight;

      draw(context);
      return () => context.clearRect(0, 0, window.innerWidth, 400);
    }, [draw, canvasRef]);

    if (!canvasRef) {
      return null;
    }

    return (
      <canvas className="w-full aspect-[2]" ref={canvasRef as any} {...props} />
    );
  }
);
interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  snakeBody: Position[];
  foodPosition?: Position;
}

export const SEGMENT_SIZE = 5;

const draw = ({ ctx, snakeBody, foodPosition }: DrawArgs) => {
  if (foodPosition) {
    ctx.fillStyle = "rgb(0, 200, 0)";
    ctx.fillRect(foodPosition?.x, foodPosition?.y, SEGMENT_SIZE, SEGMENT_SIZE);
  }

  ctx.fillStyle = "rgb(200, 0, 0)";
  snakeBody.forEach((segment) =>
    ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE)
  );
};

interface GameProps {}

export enum GameState {
  RUNNING,
  GAME_OVER,
  PAUSED,
}

const SnakeGame: React.FC<GameProps> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.RUNNING);
  const onGameOver = () => setGameState(GameState.GAME_OVER);

  const { snakeBody, onKeyDownHandler, foodPosition, resetGameState } =
    useGameLogic({
      canvasHeight: canvasRef.current?.getBoundingClientRect().height || 0,
      canvasWidth: canvasRef.current?.getBoundingClientRect().width || 0,
      onGameOver,
      gameState,
    });
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    draw({ ctx, snakeBody, foodPosition });
  };
  // useEffect(() => {
  //   drawGame(canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
  // }, [snakeBody, foodPosition]);
  const gameStore = useGameStore();
  useEffect(() => {
    gameStore.setGameStarted(true);
  }, []);
  return (
    <div tabIndex={0} onKeyDown={onKeyDownHandler}>
      <Canvas ref={canvasRef} draw={drawGame} />
      {gameState === GameState.GAME_OVER ? (
        <button
          onClick={() => {
            setGameState(GameState.RUNNING);
            resetGameState();
          }}
        >
          Play Again
        </button>
      ) : (
        <button
          onClick={() => {
            setGameState(
              gameState === GameState.RUNNING
                ? GameState.PAUSED
                : GameState.RUNNING
            );
          }}
        >
          {gameState === GameState.RUNNING ? "pause" : "play"}
        </button>
      )}
      <div>{`Your score: ${(snakeBody.length - 1) * 10} `}</div>
    </div>
  );
};
export default SnakeGame;
