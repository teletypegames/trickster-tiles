import Phaser from "phaser";
import { ObstacleSpikeBase } from "./ObstacleSpikeBase";

export class ObstacleSpikeNormal extends ObstacleSpikeBase {
    static readonly TEXTURE_KEY = "spike-normal";
    static readonly WIDTH = 40;
    static readonly HEIGHT = 20;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, ObstacleSpikeNormal.TEXTURE_KEY);
    }
}
