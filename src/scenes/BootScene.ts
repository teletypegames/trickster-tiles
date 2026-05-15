import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import {
    ObstacleSpikeNormal,
    ObstacleSpikeTricky,
} from "../entities/obstacles";

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload(): void {
        this.load.svg(Player.TEXTURE_KEY, "/sprites/player.svg", { width: 32, height: 32 });
        this.load.svg(Exit.TEXTURE_KEY, "/sprites/exit.svg", {
            width: Exit.WIDTH,
            height: Exit.HEIGHT,
        });
        this.load.svg(Platform.TEXTURE_KEY, "/sprites/platform.svg", { width: 40, height: 40 });
        this.load.svg(ObstacleSpikeNormal.TEXTURE_KEY, "/sprites/spike-normal.svg", {
            width: ObstacleSpikeNormal.WIDTH,
            height: ObstacleSpikeNormal.HEIGHT,
        });
        this.load.svg(ObstacleSpikeTricky.TEXTURE_KEY, "/sprites/spike-tricky.svg", {
            width: ObstacleSpikeTricky.WIDTH,
            height: ObstacleSpikeTricky.HEIGHT,
        });
    }

    create(): void {
        const w = this.scale.width;
        const h = this.scale.height;
        const cx = w / 2;

        this.cameras.main.setBackgroundColor("#1a1a2e");

        this.add.tileSprite(cx, h - 20, w, 40, Platform.TEXTURE_KEY);

        this.add
            .text(cx, 130, "TRICKSTER", {
                fontFamily: "Arial Black, Arial",
                fontSize: "78px",
                color: "#ffd700",
                fontStyle: "bold",
                stroke: "#7a5500",
                strokeThickness: 6,
            })
            .setOrigin(0.5);

        this.add
            .text(cx, 200, "TILES", {
                fontFamily: "Arial Black, Arial",
                fontSize: "78px",
                color: "#ffd700",
                fontStyle: "bold",
                stroke: "#7a5500",
                strokeThickness: 6,
            })
            .setOrigin(0.5);

        this.add
            .text(cx, 270, "a pixel-art platformer", {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#aaaaaa",
                fontStyle: "italic",
            })
            .setOrigin(0.5);

        this.add.image(cx - 80, 360, Player.TEXTURE_KEY);
        this.add.image(cx, 374, ObstacleSpikeNormal.TEXTURE_KEY);
        this.add.image(cx + 80, 374, ObstacleSpikeTricky.TEXTURE_KEY);

        const startText = this.add
            .text(cx, 450, "PRESS SPACE TO START", {
                fontFamily: "Arial",
                fontSize: "26px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.25,
            duration: 600,
            yoyo: true,
            repeat: -1,
        });

        this.add
            .text(cx, 510, "← → / A D  to move    SPACE / ↑ / W  to jump", {
                fontFamily: "Arial",
                fontSize: "14px",
                color: "#888888",
            })
            .setOrigin(0.5);

        const start = () => this.scene.start("GameScene");
        this.input.keyboard?.once("keydown-SPACE", start);
        this.input.keyboard?.once("keydown-ENTER", start);
        this.input.once("pointerdown", start);
    }
}
