import Phaser from "phaser";

type PhysicsBodyHolder =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Physics.Arcade.Body
    | Phaser.Physics.Arcade.StaticBody
    | Phaser.Tilemaps.Tile;

function getBody(target: PhysicsBodyHolder): Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody {
    if (target instanceof Phaser.Physics.Arcade.Body || target instanceof Phaser.Physics.Arcade.StaticBody) {
        return target;
    }
    return (target as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as
        | Phaser.Physics.Arcade.Body
        | Phaser.Physics.Arcade.StaticBody;
}

export class Platform extends Phaser.GameObjects.TileSprite {
    static readonly TEXTURE_KEY = "platform";

    declare body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, Platform.TEXTURE_KEY);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }

    // Phaser collider processCallback: only collide when the mover is descending onto the top.
    static canLand: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (mover, platform) => {
        const moverBody = getBody(mover) as Phaser.Physics.Arcade.Body;
        const platBody = getBody(platform) as Phaser.Physics.Arcade.StaticBody;
        return (
            moverBody.velocity.y >= 0 &&
            moverBody.bottom - moverBody.deltaY() <= platBody.top
        );
    };
}
