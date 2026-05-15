import Phaser from "phaser";

export class ObstacleSpikeNormal extends Phaser.GameObjects.Image {
    static readonly TEXTURE_KEY = "spike-normal";
    static readonly WIDTH = 40;
    static readonly HEIGHT = 20;

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ObstacleSpikeNormal.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
