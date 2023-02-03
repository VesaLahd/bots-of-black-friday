import { Move } from "./types/Move";
import { Player } from "./types/Player";
import { Position } from "./types/Position";

export const isSamePosition = (p1: Position, p2: Position) => p1.x === p2.x && p1.y === p2.y

export const distanceBetweenPositions = (p1: Position, p2: Position) => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)

export const moveToPosition = (p: Position, us: Player): Move => {
  if (p.y > us.position.y) return "DOWN";
  if (p.y < us.position.y) return "UP";
  if (p.x < us.position.x) return "LEFT"
  if (p.x > us.position.x) return "RIGHT"
  return "PICK"
}