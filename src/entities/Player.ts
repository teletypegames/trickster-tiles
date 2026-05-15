import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Rectangle {
    static readonly SIZE = 32;
    static readonly COLOR = 0xff4444;
    static readonly MOVE_SPEED = 250;
    static readonly JUMP_VELOCITY = 480;

    declare body: Phaser.Physics.Arcade.Body;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyW: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, Player.SIZE, Player.SIZE, Player.COLOR);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        const kb = scene.input.keyboard!;
        this.cursors = kb.createCursorKeys();
        this.keyA = kb.addKey("A");
        this.keyD = kb.addKey("D");
        this.keyW = kb.addKey("W");
        this.keySpace = kb.addKey("SPACE");
    }

    override update(): void {
        const left = this.cursors.left.isDown || this.keyA.isDown;
        const right = this.cursors.right.isDown || this.keyD.isDown;
        const jumpPressed =
            Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.keyW) ||
            Phaser.Input.Keyboard.JustDown(this.keySpace);

        if (left) {
            this.body.setVelocityX(-Player.MOVE_SPEED);
        } else if (right) {
            this.body.setVelocityX(Player.MOVE_SPEED);
        } else {
            this.body.setVelocityX(0);
        }

        if (jumpPressed && this.body.touching.down) {
            this.body.setVelocityY(-Player.JUMP_VELOCITY);
        }
    }

    freeze(): void {
        this.body.setVelocity(0, 0);
        this.body.moves = false;
    }
}
