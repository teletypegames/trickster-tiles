import Phaser from "phaser";

export class Exit extends Phaser.GameObjects.Rectangle {
    static readonly WIDTH = 40;
    static readonly HEIGHT = 80;
    static readonly COLOR = 0xffd700;

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, groundY: number) {
        super(scene, x, groundY - Exit.HEIGHT / 2, Exit.WIDTH, Exit.HEIGHT, Exit.COLOR);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
