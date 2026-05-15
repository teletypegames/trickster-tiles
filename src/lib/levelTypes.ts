export const TILE_SIZE = 40;
export const LEVEL_COLS = 20;
export const LEVEL_ROWS = 15;

export enum TileType {
    Empty = 0,
    Platform = 1,
    Player = 2,
    Exit = 3,
    DisappearingPlatform = 4,
    Spike = 5,
    TrickySpike = 6,
}

export type LevelMatrix = TileType[][];

export interface LevelDef {
    name: string;
    matrix: LevelMatrix;
}

const CHAR_TO_TILE: Record<string, TileType> = {
    ".": TileType.Empty,
    "#": TileType.Platform,
    "P": TileType.Player,
    "E": TileType.Exit,
    "~": TileType.DisappearingPlatform,
    "^": TileType.Spike,
    "T": TileType.TrickySpike,
};

const EMPTY_ROW = ".".repeat(LEVEL_COLS);

function parseLevel(rows: string[]): LevelMatrix {
    return rows.map((row, rowIdx) =>
        [...row].map((c, colIdx) => {
            const tile = CHAR_TO_TILE[c];
            if (tile === undefined) {
                throw new Error(`Invalid tile char '${c}' at row ${rowIdx}, col ${colIdx}`);
            }
            return tile;
        }),
    );
}

export function defineLevel(name: string, rows: string[]): LevelDef {
    if (rows.length > LEVEL_ROWS) {
        throw new Error(
            `Level "${name}" has ${rows.length} rows, max is ${LEVEL_ROWS}`,
        );
    }
    const padCount = LEVEL_ROWS - rows.length;
    const padded = padCount > 0 ? [...Array(padCount).fill(EMPTY_ROW), ...rows] : rows;
    return { name, matrix: parseLevel(padded) };
}
