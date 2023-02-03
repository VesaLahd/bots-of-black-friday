import { GameMap } from "./types/GameMap";
import { GameState } from "./types/GameState";
import { Item } from "./types/Item";
import { Move } from "./types/Move";
import { Player } from "./types/Player";
import { Position } from "./types/Position";

export const isSamePosition = (p1: Position, p2: Position) =>
  p1.x === p2.x && p1.y === p2.y;

export const distanceBetweenPositions = (p1: Position, p2: Position) =>
  Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

export const moveToPosition = (p: Position, us: Player): Move => {
  if (p.y > us.position.y) return "DOWN";
  if (p.y < us.position.y) return "UP";
  if (p.x < us.position.x) return "LEFT";
  return "RIGHT";
};

export const isAffordable = (item: Item, money: number) => {
  const price = item.price - (item.discountPercent / 100) * item.price;
  return price <= money;
};

export const positionNeighbors = (position: Position): Position[] => [
  { x: position.x - 1, y: position.y },
  { x: position.x + 1, y: position.y },
  { x: position.x, y: position.y - 1 },
  { x: position.x, y: position.y + 1 },
];

enum Tile {
  FLOOR = "_",
  WALL = "X",
  EXIT = "o",
}

const isTile =
  (tile: Tile) =>
  (map: GameMap, position: Position): boolean =>
    !!(map.tiles[position.y]?.at(position.x) === tile);

export const isWall = isTile(Tile.WALL);

export const isExit = isTile(Tile.EXIT);

export const isOccupied = (players: Player[], position: Position) =>
  players.some((p) => isSamePosition(p.position, position));

export const hasHighestScore = (scoreboard: Player[], us: Player) =>
  scoreboard.every((p) => p.score < us.score);

export const nearestBeer = (players: Player[], items: Item[], us: Player) => {
  const notOccupied = items
    .filter(
      (item) =>
        item.type === "POTION" &&
        !players.some((p) => isSamePosition(p.position, item.position))
    )
    .map((item) => item.position);

  if (notOccupied.length) {
    return notOccupied.reduce((acc, beer) =>
      distanceBetweenPositions(acc, us.position) <
      distanceBetweenPositions(beer, us.position)
        ? acc
        : beer
    );
  }
  return null;
};

export const itemScore = (item: Item, us: Player) => {
  const distance = distanceBetweenPositions(item.position, us.position);
  const price = item.price - (item.discountPercent / 100) * item.price;

  return distance / price;
};

export const mostValuableItem = (
  players: Player[],
  items: Item[],
  us: Player
) => {
  const notOccupied = items.filter(
    (item) =>
      item.type !== "POTION" &&
      !players.some((p) => isSamePosition(p.position, item.position))
  );

  if (notOccupied.length) {
    return notOccupied.reduce((acc, item) =>
      itemScore(acc, us) > itemScore(item, us) ? acc : item
    ).position;
  }
  return null;
};

export const findMostValuableTarget = (
  exit: Position,
  gameState: GameState,
  us: Player
) => {
  let target = null;
  if (hasHighestScore(gameState.finishedPlayers, us)) {
    target = exit;
  }

  const otherPlayers = gameState.players.filter((p) => p.name !== us.name);

  if (us.health < 60) {
    target = nearestBeer(otherPlayers, gameState.items, us);
  }
  if (us.money > 100) {
    target = mostValuableItem(otherPlayers, gameState.items, us);
  }

  if (!target) target = exit;
  return exit;
};
