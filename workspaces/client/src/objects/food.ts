import 'phaser'
export default class Food extends Phaser.GameObjects.Image{
    total: number;

    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, 'food');
        this.setPosition(x * 16, y * 16);
        this.setOrigin(0);
        this.total = 0;
        scene.children.add(this);
    }

    eat () {
        this.total++;
    }
}
