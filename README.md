# Trickster Tiles

A small pixel-art platformer built with [Phaser 3](https://phaser.io/), TypeScript and Vite. Hop, jump, and outwit moving spikes and disappearing tiles across 10 levels.

## Controls

| Action | Keys |
| --- | --- |
| Move | `←` `→` / `A` `D` |
| Jump | `SPACE` / `↑` / `W` |
| Start | `SPACE` / `ENTER` / mouse click (on title screen) |

Falling off the bottom of the screen restarts the current level. Reaching the exit advances to the next.

## Running

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

Requires Node.js 18+.

## Project layout

```
src/
  main.ts                       Phaser.Game bootstrap
  scenes/
    BootScene.ts                Title screen, sprite preloading
    GameScene.ts                Gameplay loop, collisions, level transitions
  entities/
    Player.ts                   Input handling + movement
    Platform.ts                 Solid platform (one-way landing)
    Exit.ts                     Level exit goal
    obstacles/
      ObstacleSpikeBase.ts      Shared spike init
      ObstacleSpikeNormal.ts    Static spike
      ObstacleSpikeTricky.ts    Spike that jumps away when approached
      ObstaclePlatformDisappearing.ts  Platform that fades on proximity
  lib/
    levelTypes.ts               Tile enum, ASCII parser, defineLevel()
    LevelLoader.ts              Builds entities from a level matrix
  levels/
    01_level.ts ... 10_level.ts Individual level definitions
    index.ts                    Aggregated LEVELS array
public/
  sprites/                      SVG sprites loaded by BootScene
```

## Level format

Levels are written as a short array of ASCII rows passed to `defineLevel(name, rows)`. Missing top rows are auto-padded with empty rows up to `LEVEL_ROWS` (15), so most levels only need to describe the bottom of the playfield.

Tile characters:

| Char | Tile |
| --- | --- |
| `.` | Empty |
| `#` | Platform |
| `P` | Player spawn |
| `E` | Exit |
| `~` | Disappearing platform |
| `^` | Static spike |
| `T` | Tricky spike (moves when the player approaches) |

Example (`src/levels/05_level.ts`):

```ts
import { defineLevel } from "../lib/levelTypes";

export const level05 = defineLevel("Pit Crossing", [
    ".E.................P",
    "####...######...####",
    "####^^^######^^^####",
]);
```

To add a new level: create `src/levels/NN_level.ts`, import and append it in `src/levels/index.ts`.

## Tech

- Phaser 3 (Arcade Physics)
- TypeScript (strict mode)
- Vite
