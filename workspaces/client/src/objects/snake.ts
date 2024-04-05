import 'phaser';
import { UP, DOWN, LEFT, RIGHT } from '../constants/directions'
import { UI } from '../ui';
import GameScene from '../game-scene';


export default class Snake {
    body: any;
    alive: boolean;
    updated: boolean;
    moveTime: number;
    head: any;
    tail: any;
    direction: number;
    heading: number;
    speed: number;
    headPosition: Phaser.Geom.Point;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();
        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);

        this.alive = true
        this.speed = 100;
        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = RIGHT;
        this.direction = RIGHT;

    }

    update(time: number): boolean {
        if (time >= this.moveTime) {
            return this.move(time);
        }
    }
    faceLeft(): void {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = LEFT;
        }
    }


    faceRight(): void {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = RIGHT;
        }
    }


    faceUp(): void {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = UP;
        }
    }


    faceDown(): void {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = DOWN;
        }
    }

    move(time) {
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 24);
                break;
            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 24);
                break;
            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 37);
                break;
            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 37);
                break;
        }
        this.direction = this.heading;
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
        if (hitBody) {
            console.log('dead');
            this.alive = false;
            return false
        } else {

            this.moveTime = time + this.speed;
            return true;
        }
    }

    grow() {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
    }

    collideWithFood(food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            food.eat();

            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }

            return true;
        }
        else {
            return false;
        }
    }

    updateGrid(grid) {
        this.body.children.each((segment) => {
            var bx = segment.x / 16;
            var by = segment.y / 16;
            grid[by][bx] = false;
        });
        return grid;
    }


};