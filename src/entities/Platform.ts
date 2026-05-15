import Phaser from "phaser";

export class Platform extends Phaser.GameObjects.TileSprite {
    static readonly TEXTURE_KEY = "platform";

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, Platform.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    // Phaser collider processCallback: only collide when the mover is descending onto the top.
    static canLand(
        mover: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        platform: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    ): boolean {
        const moverBody = mover.body as Phaser.Physics.Arcade.Body;
        const platBody = platform.body as Phaser.Physics.Arcade.StaticBody;
        return (
            moverBody.velocity.y >= 0 &&
            moverBody.bottom - moverBody.deltaY() <= platBody.top
        );
    }
}
