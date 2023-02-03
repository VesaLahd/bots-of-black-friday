import { getGameState, move, register } from "./api";
import { Position } from "./types/Position";
import {
  distanceBetweenPositions,
  findMostValuableTarget,
  isAffordable,
  isExit,
  isOccupied,
  isSamePosition,
  isWall,
  moveToPosition,
  positionNeighbors,
} from "./utils";
const aStar: any = require("a-star");

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

  let goingToExit = false;

  const isValid = (pos: Position) => {
    //TODO
    if (isWall(startingInformation.map, pos)) {
      return false;
    }

    if (!goingToExit && isExit(startingInformation.map, pos)) {
      return false;
    }

    return true;
  };

  setInterval(async () => {
    let target = startingInformation.map.exit;
    const gameState = await getGameState();
    const us = gameState.players.find((p) => p.name === myName);
    if (!us) return;

    const otherPlayers = gameState.players.filter((p) => p.name !== myName);

    if (
      otherPlayers.length > 0 &&
      us.usableItems.length > 0 &&
      us.health < 100
    ) {
      return move(startingInformation.id, "USE");
    }

    if (!goingToExit) {
      target = findMostValuableTarget(
        startingInformation.map.exit,
        gameState,
        us
      );
      if (isSamePosition(target, startingInformation.map.exit))
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
      neighbor: (node: Position) => positionNeighbors(node).filter(isValid),
      hash: (node: Position) => {
        return JSON.stringify(node);
      },
      distance: () => 1,
      heuristic: (node: Position) => distanceBetweenPositions(node, target),
      timeout: 500,
    });

    const nextMove = moveToPosition(next, us);

    return move(startingInformation.id, nextMove);
  }, 100);
};

if (require.main === module) {
  main();
}
