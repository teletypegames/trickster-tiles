import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import { LevelMatrix, TILE_SIZE, TileType } from "./levels";

export interface LoadedLevel {
    player: Player;
    exit: Exit;
    platforms: Platform[];
}

interface Cell {
    row: number;
    col: number;
}

export class LevelLoader {
    constructor(private readonly scene: Phaser.Scene) {}

    load(matrix: LevelMatrix): LoadedLevel {
        const platforms = this.buildPlatforms(matrix);
        const player = this.buildPlayer(matrix);
        const exit = this.buildExit(matrix);
        return { player, exit, platforms };
    }

    /**
     * Merge contiguous Platform tiles in each row into a single rectangle to
     * avoid corner-catching issues between adjacent 1-tile static bodies.
     */
    private buildPlatforms(matrix: LevelMatrix): Platform[] {
        const result: Platform[] = [];
        for (let row = 0; row < matrix.length; row++) {
            const cols = matrix[row].length;
            let runStart = -1;
            for (let col = 0; col <= cols; col++) {
                const isPlatform = col < cols && matrix[row][col] === TileType.Platform;
                if (isPlatform && runStart === -1) {
                    runStart = col;
                } else if (!isPlatform && runStart !== -1) {
                    const width = (col - runStart) * TILE_SIZE;
                    const x = runStart * TILE_SIZE + width / 2;
                    const y = row * TILE_SIZE + TILE_SIZE / 2;
                    result.push(new Platform(this.scene, x, y, width, TILE_SIZE));
                    runStart = -1;
                }
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
