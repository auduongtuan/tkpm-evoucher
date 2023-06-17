import useEventListener from "@/hooks/useEventListener";
import useInterval from "@/hooks/useInterval";
import { useEffect, useState } from "react";
import useGameStore from "../../stores/useGameStore";
const Snake = (props) => {
  return (
    <div>
      {props.snakeDots.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        };
        return (
          <div
            className="w-[2%] h-[2%] absolute bg-red-600 border-white border-1 z-[2]"
            key={i}
            style={style}
          />
        );
      })}
    </div>
  );
};
const Food = (props) => {
  const style = {
    left: `${props.dot[0]}%`,
    top: `${props.dot[1]}%`,
  };
  return (
    <div
      className="absolute w-[2%] h-[2%] bg-white rounded-sm z-1"
      style={style}
    />
  );
};

const getRandomFood = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 100,
  snakeDots: [
    [0, 0],
    [0, 2],
  ],
};

const SnakeGame = () => {
  const [state, setState] = useState(initialState);
  const gameState = useGameStore();

  const keyDownHandler = (e) => {
    switch (e.keyCode) {
      case 37:
        setState((state) => ({ ...state, direction: "LEFT" }));
        break;
      case 38:
        setState((state) => ({ ...state, direction: "UP" }));
        break;
      case 39:
        setState((state) => ({ ...state, direction: "RIGHT" }));
        break;
      case 40:
        setState((state) => ({ ...state, direction: "DOWN" }));
        break;
    }
  };
  useInterval(moveSnake, state.speed);
  useEventListener("keydown", keyDownHandler);
  useEffect(() => {
    onSnakeOutOfBounds();
    onSnakeCollapsed();
    onSnakeEats();
  }, [state]);
  useEffect(() => {
    if (gameState.gameStarted) {
      setState((state) => ({ ...state, ...initialState }));
    }
  }, [gameState.gameStarted]);
  function moveSnake() {
    let dots = [...state.snakeDots];
    let head = dots[dots.length - 1];
    if (gameState.gameStarted) {
      switch (state.direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
      }
      dots.push(head);
      dots.shift();
      setState((state) => ({
        ...state,
        snakeDots: dots,
      }));
    }
  }

  function onSnakeOutOfBounds() {
    let head = state.snakeDots[state.snakeDots.length - 1];
    if (gameState.gameStarted) {
      if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
        gameOver();
      }
    }
  }

  function onSnakeCollapsed() {
    let snake = [...state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        gameOver();
      }
    });
  }

  function onSnakeEats() {
    let head = state.snakeDots[state.snakeDots.length - 1];
    gameState.setScore(state.snakeDots.length - 2);
    let food = state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      setState((state) => ({
        ...state,
        food: getRandomFood(),
      }));
      increaseSnake();
      increaseSpeed();
    }
  }

  function increaseSnake() {
    let newSnake = [...state.snakeDots];
    newSnake.unshift([]);
    setState((state) => ({
      ...state,
      snakeDots: newSnake,
    }));
  }

  function increaseSpeed() {
    if (state.speed > 10) {
      setState((state) => ({
        ...state,
        speed: state.speed - 20,
      }));
    }
  }

  // function onRouteChange() {
  //   setState((state) => ({
  //     ...state,
  //     route: "game",
  //   }));
  // }

  function gameOver() {
    // alert(`GAME OVER, your score is ${state.snakeDots.length - 2}`);
    if (!gameState.gameOver) {
      gameState.setGameOver(true);
      gameState.setGameStarted(false);
      gameState.setBestScore("SNAKE", state.snakeDots.length - 2);
    }
    // setState(initialState);
  }

  function onDown() {
    let dots = [...state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0], head[1] + 2];
    dots.push(head);
    dots.shift();
    setState((state) => ({
      ...state,
      direction: "DOWN",
      snakeDots: dots,
    }));
  }

  const onUp = () => {
    let dots = [...state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0], head[1] - 2];
    dots.push(head);
    dots.shift();
    setState((state) => ({
      ...state,
      direction: "UP",
      snakeDots: dots,
    }));
  };

  const onRight = () => {
    let dots = [...state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0] + 2, head[1]];
    dots.push(head);
    dots.shift();
    setState((state) => ({
      ...state,
      direction: "RIGHT",
      snakeDots: dots,
    }));
  };

  const onLeft = () => {
    let dots = [...state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0] - 2, head[1]];
    dots.push(head);
    dots.shift();
    setState((state) => ({
      ...state,
      direction: "LEFT",
      snakeDots: dots,
    }));
  };

  const { snakeDots, food } = state;
  return (
    <>
      <div>{gameState.score}</div>
      <div className="relative flex flex-wrap w-full overflow-hidden bg-gray-800 border-2 border-red-600 game-area aspect-square">
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
      </div>
    </>
  );
};

export default SnakeGame;
// {route === "menu" ? (
//   <div>
//     {/* <Menu onRouteChange={this.onRouteChange} /> */}
//   </div>
// ) : (
//   <div>
//     <div className="game-area">
//       <Snake snakeDots={snakeDots} />
//       <Food dot={food} />
//     </div>
//     {/* <Button
//       onDown={onDown}
//       onLeft={onLeft}
//       onRight={onRight}
//       onUp={onUp}
//     /> */}
//   </div>
// )}
