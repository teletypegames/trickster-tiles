import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import {
    ObstacleSpikeNormal,
    ObstacleSpikeTricky,
} from "../entities/obstacles";

interface SpriteAsset {
    key: string;
    path: string;
    width: number;
    height: number;
}

const SPRITE_ASSETS: SpriteAsset[] = [
    { key: Player.TEXTURE_KEY, path: "/sprites/player.svg", width: Player.SIZE, height: Player.SIZE },
    { key: Exit.TEXTURE_KEY, path: "/sprites/exit.svg", width: Exit.WIDTH, height: Exit.HEIGHT },
    { key: Platform.TEXTURE_KEY, path: "/sprites/platform.svg", width: 40, height: 40 },
    {
        key: ObstacleSpikeNormal.TEXTURE_KEY,
        path: "/sprites/spike-normal.svg",
        width: ObstacleSpikeNormal.WIDTH,
        height: ObstacleSpikeNormal.HEIGHT,
    },
    {
        key: ObstacleSpikeTricky.TEXTURE_KEY,
        path: "/sprites/spike-tricky.svg",
        width: ObstacleSpikeTricky.WIDTH,
        height: ObstacleSpikeTricky.HEIGHT,
    },
];

const TITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "Arial Black, Arial",
    fontSize: "78px",
    color: "#ffd700",
    fontStyle: "bold",
    stroke: "#7a5500",
    strokeThickness: 6,
};

const SUBTITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "Arial",
    fontSize: "18px",
    color: "#aaaaaa",
    fontStyle: "italic",
};

const PROMPT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "Arial",
    fontSize: "26px",
    color: "#ffffff",
    fontStyle: "bold",
};

const HINT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "Arial",
    fontSize: "14px",
    color: "#888888",
};

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload(): void {
        for (const asset of SPRITE_ASSETS) {
            this.load.svg(asset.key, asset.path, { width: asset.width, height: asset.height });
        }
    }

    create(): void {
        const w = this.scale.width;
        const h = this.scale.height;
        const cx = w / 2;

        this.cameras.main.setBackgroundColor("#1a1a2e");

        this.add.tileSprite(cx, h - 20, w, 40, Platform.TEXTURE_KEY);

        this.add.text(cx, 130, "TRICKSTER", TITLE_STYLE).setOrigin(0.5);
        this.add.text(cx, 200, "TILES", TITLE_STYLE).setOrigin(0.5);
        this.add.text(cx, 270, "a pixel-art platformer", SUBTITLE_STYLE).setOrigin(0.5);

        this.add.image(cx - 80, 360, Player.TEXTURE_KEY);
        this.add.image(cx, 374, ObstacleSpikeNormal.TEXTURE_KEY);
        this.add.image(cx + 80, 374, ObstacleSpikeTricky.TEXTURE_KEY);

        const startText = this.add
            .text(cx, 450, "PRESS SPACE TO START", PROMPT_STYLE)
            .setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.25,
            duration: 600,
            yoyo: true,
            repeat: -1,
        });

        this.add
            .text(cx, 510, "← → / A D  to move    SPACE / ↑ / W  to jump", HINT_STYLE)
            .setOrigin(0.5);

        const start = () => this.scene.start("GameScene");
        this.input.keyboard?.once("keydown-SPACE", start);
        this.input.keyboard?.once("keydown-ENTER", start);
        this.input.once("pointerdown", start);
    }
}
