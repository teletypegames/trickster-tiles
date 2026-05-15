import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Exit } from "../entities/Exit";
import { Platform } from "../entities/Platform";

export class GameScene extends Phaser.Scene {
    private static readonly FLOOR_TOP = 500;
    private static readonly FLOOR_HEIGHT = 100;

    private player!: Player;
    private exit!: Exit;
    private platform!: Platform;
    private levelCompleteText!: Phaser.GameObjects.Text;
    private levelCompleted = false;

    constructor() {
        super({ key: "GameScene" });
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;
        const floorTop = GameScene.FLOOR_TOP;
        const floorH = GameScene.FLOOR_HEIGHT;

        this.platform = new Platform(this, width / 2, floorTop + floorH / 2, width, floorH);
        this.exit = new Exit(this, 60, floorTop);
        this.player = new Player(this, width - Player.SIZE - 40, floorTop - Player.SIZE / 2);

        this.physics.add.collider(this.player, this.platform);
        this.physics.add.overlap(this.player, this.exit, () => this.completeLevel());

        this.levelCompleteText = this.add
            .text(width / 2, height / 2, "LEVEL COMPLETED!", {
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
    }

    private completeLevel(): void {
        if (this.levelCompleted) return;
        this.levelCompleted = true;
        this.player.freeze();
        this.levelCompleteText.setVisible(true);
    }
}
