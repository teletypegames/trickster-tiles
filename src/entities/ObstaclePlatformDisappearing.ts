import Phaser from "phaser";
import { Platform } from "./Platform";

export class ObstaclePlatformDisappearing extends Phaser.GameObjects.TileSprite {
    static readonly TRIGGER_DISTANCE = 110;
    static readonly FADE_MS = 200;

    declare body: Phaser.Physics.Arcade.StaticBody;

    private vanished = false;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, Platform.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    react(playerX: number, playerY: number): void {
        if (this.vanished) return;
        const dx = this.x - playerX;
        const dy = this.y - playerY;
        if (Math.hypot(dx, dy) < ObstaclePlatformDisappearing.TRIGGER_DISTANCE) {
            this.vanish();
        }
    }

    private vanish(): void {
        this.vanished = true;
        this.body.enable = false;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: ObstaclePlatformDisappearing.FADE_MS,
            onComplete: () => this.setVisible(false),
        });
    }
}
