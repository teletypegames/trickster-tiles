import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";
import { LEVELS } from "../levels/levels";
import { LevelLoader } from "../levels/LevelLoader";

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
    private levelCompleted = false;
    private hudText!: Phaser.GameObjects.Text;
    private centerText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "GameScene" });
    }

    init(data: SceneData): void {
        this.levelIndex = data.levelIndex ?? 0;
        this.levelCompleted = false;
        this.platforms = [];
    }

    create(): void {
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height + 200);

        const def = LEVELS[this.levelIndex];
        const loader = new LevelLoader(this);
        const loaded = loader.load(def.matrix);
        this.player = loaded.player;
        this.exit = loaded.exit;
        this.platforms = loaded.platforms;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.exit, () => this.completeLevel());

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
        if (this.levelCompleted) return;
        this.player.update();

        if (this.player.y > this.scale.height + GameScene.FALL_LIMIT_PADDING) {
            this.restartLevel();
        }
    }

    private completeLevel(): void {
        if (this.levelCompleted) return;
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

    private restartLevel(): void {
        this.scene.restart({ levelIndex: this.levelIndex });
    }
}
