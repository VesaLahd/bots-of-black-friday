import { getGameState, move, register, say } from "./api";
import { Player } from "./types/Player";
import { Position } from "./types/Position";
import {
  distanceBetweenPositions,
  findMostValuableTarget,
  isAffordable,
  isExit,
  isMine,
  isOccupied,
  isSamePosition,
  isWall,
  moveToPosition,
  positionNeighbors,
} from "./utils";
const aStar: any = require("a-star");

const spawnMessages = [
  '💩storm is rising',
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "RUSH B!!!",
]

const gunSounds = [
  'PEW PEW',
  "RATATATATATATATA",
  "Prepare to die",
]

const moveSounds = [
  `And I would walk 500 miles
  And I would roll 500 more`,
  "Hut, two, three, four",
  "Oispa kaljaa",
  "Bottom text",
  ":koilliskulma:",
  "U can't touch this",
  "Gotta go fast",
  "I am speed"
]

const getRandomIndex = (max: number) => Math.floor(Math.random() * max)

function maybeSaySomething(id: string) {
  const randomIndex = getRandomIndex(30)
  if (randomIndex === 0) {
    say(id, moveSounds[getRandomIndex(moveSounds.length)])
  }
}

export const main = async () => {
  // Look in the api.ts file for api calls
  // First you need to register your bot to the game server.
  // When registering, you will receive an id for your bot.
  // This will be used to control your bot.

  // You need to wait one second between each action.

  // Below is example code for a bot that after
  // being registered moves randomly to left and right.
  // You can use this code as a starting point for your own implementation.
  const myName = "💩";
  const startingInformation = await register(myName);

  setTimeout(() => {
    say(
      startingInformation.id,
      spawnMessages[getRandomIndex(spawnMessages.length)]
    )
  }, 500)

  let goingToExit = false;

  const isValid = (pos: Position, user: Player) => {
    //TODO
    if (isWall(startingInformation.map, pos)) {
      return false;
    }

    if(user.health < 50 && isMine(startingInformation.map, pos)) {
      return false;
    }

    if (!goingToExit && isExit(startingInformation.map, pos)) {
      return false;
    }

    return true;
  };

  setInterval(async () => {
    maybeSaySomething(startingInformation.id)
    let target = startingInformation.map.exit;
    const gameState = await getGameState();
    const us = gameState.players.find((p) => p.name === myName);
    if (!us) return;

<<<<<<< HEAD
=======
    const mostScore = Math.max(
      ...gameState.finishedPlayers.map((p) => p.score)
    );
    if (mostScore < us.score && us.money <= 1000) {
      goingToExit = true;
    }

>>>>>>> main
    const otherPlayers = gameState.players.filter((p) => p.name !== myName);

    if (
      otherPlayers.length > 0 &&
      us.usableItems.length > 0 &&
      us.health < 100
    ) {
      say(
        startingInformation.id,
        gunSounds[getRandomIndex(gunSounds.length)]
      )
      return move(startingInformation.id, "USE");
    }

    if (!goingToExit) {
      target = findMostValuableTarget(
        startingInformation.map.exit,
        gameState,
        us
      );
<<<<<<< HEAD
      if (isSamePosition(target, startingInformation.map.exit))
=======

      if (
        affordableItems.some((item) => isSamePosition(item.position, us.position))
      ) {
        return move(startingInformation.id, "PICK");
      }

      affordableItems = affordableItems.filter(item => !isOccupied(gameState.players, item.position));

      if(affordableItems.length !== 0) {
        const closestItem = affordableItems.reduce((acc, item) => {
          if (
            distanceBetweenPositions(acc.position, us.position) >
            distanceBetweenPositions(item.position, us.position)
          )
            return item;
          return acc;
        });
        target = closestItem.position;
      } else {
>>>>>>> main
        goingToExit = true;
      // let affordableItems = gameState.items.filter((item) =>
      //   isAffordable(item, us.money)
      // );

      // if (
      //   affordableItems.some((item) => isSamePosition(item.position, us.position))
      // ) {
      //   return move(startingInformation.id, "PICK");
      // }

      // affordableItems = affordableItems.filter(item => isOccupied(gameState.players, item.position));

      // if(affordableItems.length) {
      //   const closestItem = affordableItems.reduce((acc, item) => {
      //     if (
      //       distanceBetweenPositions(acc.position, us.position) >
      //       distanceBetweenPositions(item.position, us.position)
      //     )
      //       return item;
      //     return acc;
      //   });
      //   target = closestItem.position;
      // } else {
      //   goingToExit = true;
      // }
    }

    const {
      status,
      path: [current, next],
    } = aStar({
      start: us.position,
      isEnd: (node: Position) => isSamePosition(node, target),
      neighbor: (node: Position) => positionNeighbors(node).filter(p => isValid(p, us)),
      hash: (node: Position) => {
        return JSON.stringify(node);
      },
      distance: () => 1,
      heuristic: (node: Position) => distanceBetweenPositions(node, target),
      timeout: 500,
    });

    const nextMove = moveToPosition(next, us);

    return move(startingInformation.id, nextMove);
  }, 500);
};

if (require.main === module) {
  main();
}
