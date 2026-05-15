import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import {
    ObstaclePlatformDisappearing,
    ObstacleSpikeNormal,
    ObstacleSpikeTricky,
} from "../entities/obstacles";
import { LevelMatrix, TILE_SIZE, TileType } from "./levelTypes";

export interface LoadedLevel {
    player: Player;
    exit: Exit;
    platforms: Platform[];
    disappearing: ObstaclePlatformDisappearing[];
    spikes: ObstacleSpikeNormal[];
    trickySpikes: ObstacleSpikeTricky[];
}

const cellCenterX = (col: number): number => col * TILE_SIZE + TILE_SIZE / 2;
const cellBottomY = (row: number, entityHeight: number): number =>
    (row + 1) * TILE_SIZE - entityHeight / 2;

export class LevelLoader {
    constructor(private readonly scene: Phaser.Scene) {}

    load(matrix: LevelMatrix): LoadedLevel {
        return {
            player: this.buildSingleton(
                matrix,
                TileType.Player,
                Player.SIZE,
                (x, y) => new Player(this.scene, x, y),
                "Player",
            ),
            exit: this.buildSingleton(
                matrix,
                TileType.Exit,
                Exit.HEIGHT,
                (x, y) => new Exit(this.scene, x, y),
                "Exit",
            ),
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
            spikes: this.buildSingleCells(
                matrix,
                TileType.Spike,
                ObstacleSpikeNormal.HEIGHT,
                (x, y) => new ObstacleSpikeNormal(this.scene, x, y),
            ),
            trickySpikes: this.buildSingleCells(
                matrix,
                TileType.TrickySpike,
                ObstacleSpikeTricky.HEIGHT,
                (x, y) => new ObstacleSpikeTricky(this.scene, x, y),
            ),
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
        entityHeight: number,
        factory: (x: number, y: number) => T,
    ): T[] {
        const result: T[] = [];
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === tileType) {
                    result.push(factory(cellCenterX(col), cellBottomY(row, entityHeight)));
                }
            }
        }
        return result;
    }

    private buildSingleton<T>(
        matrix: LevelMatrix,
        tileType: TileType,
        entityHeight: number,
        factory: (x: number, y: number) => T,
        label: string,
    ): T {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === tileType) {
                    return factory(cellCenterX(col), cellBottomY(row, entityHeight));
                }
            }
        }
        throw new Error(`Level matrix has no ${label} tile`);
    }
}
