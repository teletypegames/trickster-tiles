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

function defineLevel(name: string, rows: string[]): LevelDef {
    return { name, matrix: parseLevel(rows) };
}

export const LEVELS: readonly LevelDef[] = [
    defineLevel("Ugorj a tüskén át", [
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        ".E........^........P",
        "####################",
        "####################",
    ]),
    defineLevel("Csapda híd", [
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        ".E.................P",
        "#######~~~##########",
        "#######~~~##########",
    ]),
    defineLevel("Csaló tüske és lépcső", [
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        ".E..................",
        "#####...............",
        "....#####...........",
        "........#####.......",
        "............#####...",
        "...............####.",
        ".........T........P#",
        "####################",
    ]),
];
