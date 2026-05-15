import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 1500;

new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#1a1a2e",
    parent: "screen",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: GRAVITY },
            debug: false,
        },
    },
    scene: [BootScene, GameScene],
});
