import { GameMap } from "./types/GameMap";
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
  WALL = "x",
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
