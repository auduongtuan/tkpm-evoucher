import { useEffect, useMemo, useRef, useState } from "react";
import useEventListener from "@/hooks/useEventListener";
import { Circle, Rectangle } from "./types";
import * as constants from "./constants";
import useGameStore from "../../stores/useGameStore";
import useInterval from "@/hooks/useInterval";
// import EndDialog from './EndDialog'

// ground
let groundX = 0;

// bird
let birdX = 60;
let birdY = 120;
let birdYSpeed = 0;

// pipes
let pipeGapBottomY = constants.PIPE_HEIGHT;
let pipeX = constants.CANVAS_WIDTH;

// score
let score: number = 0;

const resetGame = () => {
  // ground
  groundX = 0;
  // bird
  birdX = 60;
  birdY = 120;
  pipeX = constants.CANVAS_WIDTH;
  birdYSpeed = 0;
  score = 0;
};

// check collision between circle and rectangle
const checkCollision = (circle: Circle, rect: Rectangle) => {
  if (
    circle.x + circle.radius >= rect.x &&
    circle.x - circle.radius <= rect.x + rect.width
  ) {
    if (
      circle.y + circle.radius >= rect.y &&
      circle.y - circle.radius <= rect.y + rect.height
    ) {
      // TODO: IMPROVE COLLISION CHECK
      return true;
    }
  }
  return false;
};

// check if bird has touched a pipe
const touchedPipe = () => {
  const birdHitbox: Circle = {
    x: birdX + constants.BIRD_WIDTH / 2,
    y: birdY + constants.BIRD_HEIGHT / 2 + 5,
    radius: 20,
  };

  const upperPipe: Rectangle = {
    x: pipeX,
    y: 0,
    width: constants.PIPE_WIDTH,
    height: pipeGapBottomY,
  };

  const lowerPipe: Rectangle = {
    x: pipeX,
    y: pipeGapBottomY + constants.PIPE_GAP,
    width: constants.PIPE_WIDTH,
    height:
      constants.CANVAS_HEIGHT -
      constants.HEIGHT_GROUND -
      (pipeGapBottomY + constants.PIPE_GAP),
  };

  return (
    checkCollision(birdHitbox, upperPipe) ||
    checkCollision(birdHitbox, lowerPipe)
  );
};

// check if bird has touched the ground
const fallOut = () =>
  birdY + constants.BIRD_HEIGHT >
  constants.CANVAS_HEIGHT - constants.HEIGHT_GROUND;

// // stop game
// const reset = () => {
//   hasStarted = false;
//   hasFinished = true;
// };

// let hasStarted = false;
// let hasFinished = false;
let canGetScore = true;

function FlappyBirdGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const gameState = useGameStore();

  // bird jump
  const jump = () => {
    console.log("jump");
    if (gameState.gameOver) {
      return;
    }
    if (!gameState.gameStarted) {
      // hasStarted = true;
      gameState.setGameStarted(true);
    }
    birdYSpeed = constants.JUMP_SPEED;
  };

  // enable space button
  const handler = (key: any) => {
    if (gameState.gameOver) {
      return;
    }
    if (key.code === "Space") {
      if (!gameState.gameStarted) {
        // hasStarted = true;
        gameState.restartGame();
      }
      jump();
    }
  };

  // useEventListener("keyup", (e) => {
  //   console.log(e);
  // });
  useEventListener("keyup", handler);

  const draw = (context: CanvasRenderingContext2D) => {
    // draw background
    context.fillStyle = "#abfcff";
    context.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

    // draw clouds
    context.drawImage(
      constants.CLOUDS,
      constants.CLOUDS_X,
      constants.CLOUDS_Y,
      constants.CLOUDS_WIDTH,
      constants.CLOUDS_HEIGHT
    );

    // draw ground
    context.drawImage(
      constants.GROUND,
      groundX,
      constants.GROUND_Y,
      constants.GROUND_WIDTH,
      constants.GROUND_HEIGHT
    );
    context.drawImage(
      constants.GROUND,
      groundX + constants.CANVAS_WIDTH,
      constants.GROUND_Y,
      constants.GROUND_WIDTH,
      constants.GROUND_HEIGHT
    );

    // draw bird
    context.drawImage(
      constants.BIRD,
      birdX,
      birdY,
      constants.BIRD_WIDTH,
      constants.BIRD_HEIGHT
    );

    // draw pipes
    context.fillStyle = "#a6a6a6";
    context.fillRect(pipeX, 0, constants.PIPE_WIDTH, pipeGapBottomY);
    context.fillRect(
      pipeX,
      pipeGapBottomY + constants.PIPE_GAP,
      constants.PIPE_WIDTH,
      constants.CANVAS_HEIGHT -
        constants.HEIGHT_GROUND -
        (pipeGapBottomY + constants.PIPE_GAP)
    );
  };

  const gameLoop = () => {
    const context = canvas.current && canvas.current.getContext("2d");
    if (context) {
      // dying
      if (touchedPipe() || fallOut()) {
        // if (score > bestScore) {
        //   bestScore = score;
        //   localStorage.setItem("bestScore", score.toString());
        // }
        gameState.setGameOver(true);
        gameState.setScore(score);
        gameState.setBestScore("FLAPPY_BIRD", score);
        resetGame();
        return;
        // gameState.setGameStarted(false);
        // reset();
      }

      // check if we should give another score
      if (canGetScore && birdX > pipeX + constants.PIPE_WIDTH) {
        canGetScore = false;
        score++;
      }

      draw(context);

      if (!gameState.gameStarted) {
        return;
      }

      // reset pipes
      if (pipeX < -constants.PIPE_WIDTH) {
        pipeX = constants.CANVAS_WIDTH;
        pipeGapBottomY = constants.PIPE_GAP * Math.random();
        canGetScore = true;
      }

      // reset ground
      if (groundX <= -constants.CANVAS_WIDTH) {
        groundX = 0;
      }

      // draw scores
      context.fillStyle = "black";
      context.font = "26px Roboto";
      context.fillText(score.toString(), constants.CANVAS_WIDTH / 2 - 15, 50);

      // movements
      pipeX -= constants.SPEED;
      groundX -= constants.SPEED;
      birdY += birdYSpeed * (constants.INTERVAL / 1000);
      birdYSpeed -= constants.FALL_SPEED * (constants.INTERVAL / 1000);
    }
  };

  const gameInterval = useInterval(
    gameLoop,
    gameState.gameOver ? null : constants.INTERVAL
  );

  return (
    <div
      onClick={() => jump()}
      // onKeyDown={() => jump()}
      className="leading-[0] round-md overflow-hidden"
    >
      <canvas
        ref={canvas}
        width={constants.CANVAS_WIDTH}
        height={constants.CANVAS_HEIGHT}
        className="w-full"
      />
      {}
      {/* <EndDialog showDialog={showModal} score={score} bestScore={bestScore}></EndDialog> */}
    </div>
  );
}

export default FlappyBirdGame;
