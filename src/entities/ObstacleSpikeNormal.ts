import Phaser from "phaser";

export class ObstacleSpikeNormal extends Phaser.GameObjects.Rectangle {
    static readonly WIDTH = 40;
    static readonly HEIGHT = 20;
    static readonly COLOR = 0xff3333;

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ObstacleSpikeNormal.WIDTH, ObstacleSpikeNormal.HEIGHT, ObstacleSpikeNormal.COLOR);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
