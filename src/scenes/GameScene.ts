import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import {
    ObstaclePlatformDisappearing,
    ObstacleSpikeNormal,
    ObstacleSpikeTricky,
} from "../entities/obstacles";
import { LEVELS } from "../levels";
import { LevelLoader } from "../lib/LevelLoader";

interface SceneData {
    levelIndex?: number;
}

export class GameScene extends Phaser.Scene {
    private static readonly TRANSITION_DELAY_MS = 1200;
    private static readonly FALL_LIMIT_PADDING = 80;

    private levelIndex = 0;
    private player!: Player;
    private exit!: Exit;
    private platforms: Platform[] = [];
    private disappearing: ObstaclePlatformDisappearing[] = [];
    private spikes: ObstacleSpikeNormal[] = [];
    private trickySpikes: ObstacleSpikeTricky[] = [];
    private levelCompleted = false;
    private dying = false;
    private hudText!: Phaser.GameObjects.Text;
    private centerText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "GameScene" });
    }

    init(data: SceneData): void {
        this.levelIndex = data.levelIndex ?? 0;
        this.levelCompleted = false;
        this.dying = false;
        this.platforms = [];
        this.disappearing = [];
        this.spikes = [];
        this.trickySpikes = [];
    }

    create(): void {
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height + 200);

        const def = LEVELS[this.levelIndex];
        const loader = new LevelLoader(this);
        const loaded = loader.load(def.matrix);
        this.player = loaded.player;
        this.exit = loaded.exit;
        this.platforms = loaded.platforms;
        this.disappearing = loaded.disappearing;
        this.spikes = loaded.spikes;
        this.trickySpikes = loaded.trickySpikes;

        this.physics.add.collider(this.player, this.platforms, undefined, Platform.canLand);
        this.physics.add.collider(this.player, this.disappearing, undefined, Platform.canLand);
        this.physics.add.overlap(this.player, this.exit, () => this.completeLevel());
        this.physics.add.overlap(this.player, this.spikes, () => this.die());
        this.physics.add.overlap(this.player, this.trickySpikes, () => this.die());

        this.hudText = this.add.text(
            12,
            10,
            `Level ${this.levelIndex + 1}/${LEVELS.length} — ${def.name}`,
            { fontFamily: "Arial", fontSize: "18px", color: "#ffffff" },
        );

        this.centerText = this.add
            .text(this.scale.width / 2, this.scale.height / 2, "", {
                fontFamily: "Arial",
                fontSize: "48px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setVisible(false);
    }

    override update(): void {
        if (this.levelCompleted || this.dying) return;
        this.player.update();

        for (const platform of this.disappearing) {
            platform.react(this.player.x, this.player.y);
        }
        for (const spike of this.trickySpikes) {
            spike.react(this.player.x);
        }

        if (this.player.y > this.scale.height + GameScene.FALL_LIMIT_PADDING) {
            this.die();
        }
    }

    private completeLevel(): void {
        if (this.levelCompleted || this.dying) return;
        this.levelCompleted = true;
        this.player.freeze();

        const isLast = this.levelIndex >= LEVELS.length - 1;
        this.centerText
            .setText(isLast ? "ALL LEVELS COMPLETED!" : "LEVEL COMPLETED!")
            .setVisible(true);

        if (isLast) return;

        this.time.delayedCall(GameScene.TRANSITION_DELAY_MS, () => {
            this.scene.restart({ levelIndex: this.levelIndex + 1 });
        });
    }

    private die(): void {
        if (this.levelCompleted || this.dying) return;
        this.dying = true;
        this.player.freeze();
        this.scene.restart({ levelIndex: this.levelIndex });
    }
}
