import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import { ObstaclePlatformDisappearing } from "../entities/ObstaclePlatformDisappearing";
import { ObstacleSpikeNormal } from "../entities/ObstacleSpikeNormal";
import { ObstacleSpikeTricky } from "../entities/ObstacleSpikeTricky";
import { LevelMatrix, TILE_SIZE, TileType } from "./levels";

export interface LoadedLevel {
    player: Player;
    exit: Exit;
    platforms: Platform[];
    disappearing: ObstaclePlatformDisappearing[];
    spikes: ObstacleSpikeNormal[];
    trickySpikes: ObstacleSpikeTricky[];
}

interface Cell {
    row: number;
    col: number;
}

export class LevelLoader {
    constructor(private readonly scene: Phaser.Scene) {}

    load(matrix: LevelMatrix): LoadedLevel {
        return {
            player: this.buildPlayer(matrix),
            exit: this.buildExit(matrix),
            platforms: this.buildHorizontalRuns(
                matrix,
                TileType.Platform,
                (x, y, w, h) => new Platform(this.scene, x, y, w, h),
            ),
            disappearing: this.buildHorizontalRuns(
                matrix,
                TileType.DisappearingPlatform,
                (x, y, w, h) => new ObstaclePlatformDisappearing(this.scene, x, y, w, h),
            ),
            spikes: this.buildSingleCells(matrix, TileType.Spike, (col, row) => {
                const x = col * TILE_SIZE + TILE_SIZE / 2;
                const y = (row + 1) * TILE_SIZE - ObstacleSpikeNormal.HEIGHT / 2;
                return new ObstacleSpikeNormal(this.scene, x, y);
            }),
            trickySpikes: this.buildSingleCells(matrix, TileType.TrickySpike, (col, row) => {
                const x = col * TILE_SIZE + TILE_SIZE / 2;
                const y = (row + 1) * TILE_SIZE - ObstacleSpikeTricky.HEIGHT / 2;
                return new ObstacleSpikeTricky(this.scene, x, y);
            }),
        };
    }

    private buildHorizontalRuns<T>(
        matrix: LevelMatrix,
        tileType: TileType,
        factory: (x: number, y: number, width: number, height: number) => T,
    ): T[] {
        const result: T[] = [];
        for (let row = 0; row < matrix.length; row++) {
            const cols = matrix[row].length;
            let runStart = -1;
            for (let col = 0; col <= cols; col++) {
                const match = col < cols && matrix[row][col] === tileType;
                if (match && runStart === -1) {
                    runStart = col;
                } else if (!match && runStart !== -1) {
                    const width = (col - runStart) * TILE_SIZE;
                    const x = runStart * TILE_SIZE + width / 2;
                    const y = row * TILE_SIZE + TILE_SIZE / 2;
                    result.push(factory(x, y, width, TILE_SIZE));
                    runStart = -1;
                }
            }
        }
        return result;
    }

    private buildSingleCells<T>(
        matrix: LevelMatrix,
        tileType: TileType,
        factory: (col: number, row: number) => T,
    ): T[] {
        const result: T[] = [];
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === tileType) result.push(factory(col, row));
            }
        }
        return result;
    }

    private buildPlayer(matrix: LevelMatrix): Player {
        const cell = this.findTile(matrix, TileType.Player);
        if (!cell) throw new Error("Level matrix has no Player tile");
        const x = cell.col * TILE_SIZE + TILE_SIZE / 2;
        const y = (cell.row + 1) * TILE_SIZE - Player.SIZE / 2;
        return new Player(this.scene, x, y);
    }

    private buildExit(matrix: LevelMatrix): Exit {
        const cell = this.findTile(matrix, TileType.Exit);
        if (!cell) throw new Error("Level matrix has no Exit tile");
        const x = cell.col * TILE_SIZE + TILE_SIZE / 2;
        const y = (cell.row + 1) * TILE_SIZE - Exit.HEIGHT / 2;
        return new Exit(this.scene, x, y);
    }

    private findTile(matrix: LevelMatrix, tile: TileType): Cell | null {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === tile) return { row, col };
            }
        }
        return null;
    }
}
