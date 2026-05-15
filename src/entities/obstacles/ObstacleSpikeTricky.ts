import Phaser from "phaser";

export class ObstacleSpikeTricky extends Phaser.GameObjects.Image {
    static readonly TEXTURE_KEY = "spike-tricky";
    static readonly WIDTH = 40;
    static readonly HEIGHT = 20;
    static readonly TRIGGER_DISTANCE = 55;
    static readonly DISPLACEMENT = 100;

    declare body: Phaser.Physics.Arcade.StaticBody;

    private moved = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ObstacleSpikeTricky.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    react(playerX: number): void {
        if (this.moved) return;
        const dx = this.x - playerX;
        if (Math.abs(dx) < ObstacleSpikeTricky.TRIGGER_DISTANCE) {
            const direction = Math.sign(dx) || 1;
            this.x += direction * ObstacleSpikeTricky.DISPLACEMENT;
            this.body.updateFromGameObject();
            this.moved = true;
        }
    }
}
