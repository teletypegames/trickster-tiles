import Phaser from "phaser";

export class Exit extends Phaser.GameObjects.Image {
    static readonly TEXTURE_KEY = "exit";
    static readonly WIDTH = 40;
    static readonly HEIGHT = 80;

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Exit.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}
