import Phaser from "phaser";

export abstract class ObstacleSpikeBase extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string) {
        super(scene, x, y, textureKey);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
