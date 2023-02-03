import { getGameState, move, register } from "./api";
import { distanceBetweenPositions, moveToPosition } from "./utils";

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

  setInterval(async () => {
    let target = startingInformation.map.exit;
    const gameState = await getGameState();
    const us = gameState.players.find(p => p.name === myName)
    if (!us) return;

    const otherPlayers = gameState.players.filter((p) => p.name !== myName)
    
    if(otherPlayers.length > 0 && us.usableItems.length > 0 && us.health < 100) {
      return move(
        startingInformation.id, "USE")
    }

    const affordableItems = gameState.items.filter(item => {
      const price = item.price - (item.discountPercent / 100 * item.price)
      return price <= us.money
    })

    const isAnyValuable = affordableItems.some(item => item.price !== 0)

    const closestItem = affordableItems.reduce((acc, item) => {
      if (distanceBetweenPositions(acc.position, us.position) > distanceBetweenPositions(item.position, us.position)) return item;
      return acc;
    });

    if (isAnyValuable) {
      const closestItem = affordableItems.reduce((acc, item) => {
      if (distanceBetweenPositions(acc.position, us.position) > distanceBetweenPositions(item.position, us.position)) return item;
      return acc;
      });
      target = closestItem.position
    }


    const nextMove = moveToPosition(target, us);

  
    return move(
      startingInformation.id,
      nextMove
    );

  }, 100);
};

if (require.main === module) {
  main();
}
