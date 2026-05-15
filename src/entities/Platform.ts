import Phaser from "phaser";

export class Platform extends Phaser.GameObjects.Rectangle {
    static readonly COLOR = 0x4a7c3a;

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, Platform.COLOR);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
