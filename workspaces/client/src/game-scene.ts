import 'phaser';
import * as Phaser from 'phaser';
import Snake from './objects/snake';
import Food from './objects/food';
import { UI } from './ui';
import { BG_HEIGHT, COLUMN_ACCEL, COLUMN_TIME_ACCEL, FLAP_THRESH, GAME_HEIGHT, GAME_WIDTH, GAP_END, GAP_MAX, GAP_MIN, GAP_START, GRAVITY, INITIAL_COLUMN_INTERVAL, INITIAL_COLUMN_VELOCITY, JUMP_COOLDOWN, JUMP_VEL, PIPE_HEIGHT, PIPE_SCALE, PIPE_WIDTH } from './consts';

export const achievements: { [k: string]: string } = {
    'first-time': 'Played 1 time',
    'five-times': 'Played 5 times',
};

async function submitPlayed(endpoint: string, walletAddress: string, score: number) {
    return await (await fetch(endpoint + '/played', {
        body: JSON.stringify({
            tg_data: (window as any).Telegram.WebApp.initData,
            wallet: walletAddress,
            score,
        }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    })).json();
}

export default class GameScene extends Phaser.Scene {
    snake: Snake;
    food: Food;
    cursors: any;
    score: number = 0;
    background!: Phaser.GameObjects.TileSprite;
    tracked: { r1: Phaser.GameObjects.Image; r2: Phaser.GameObjects.Image; scored: boolean; }[] = [];
    firstLaunch: boolean = true;
    character!: Phaser.GameObjects.Image;

    
    
    
    constructor(private ui: UI) {
        super('Main');

        ui.onPlayClicked(() => {
            ui.hideShop();
            ui.hideMain();

            this.scene.restart();
        });
    }

    getRealGameWidth() {
        return GAME_WIDTH * (this.game.canvas.parentElement!.clientWidth / this.game.canvas.clientWidth);
    }

    preload() {
        this.load.image('food', '../assets/food.png');
        this.load.image('body', '../assets/body.png');
        this.load.image('bg', 'assets/background-day.png');
    }
    create() {
        const realWidth = this.getRealGameWidth();
        this.background = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'bg');
        this.background.tileScaleX = this.background.tileScaleY = GAME_HEIGHT / BG_HEIGHT;
        this.snake = new Snake(this, 8, 8);
        this.food = new Food(this, 3, 4);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.tracked = [];
        this.score = 0;
        this.ui.setScore(this.score);
        this.lastColumn = 0;
        
        
    }

    async onOverlapped() {
        this.scene.pause();

        this.ui.showLoading();

        try {
            const playedInfo = await submitPlayed(
                this.ui.config.ENDPOINT,
                this.ui.gameFi.walletAddress.toString(),
                this.score
            ) as any;

            if (!playedInfo.ok) throw new Error('Unsuccessful');

            this.ui.showMain(true, {
                reward: playedInfo.reward,
                achievements: playedInfo.achievements.map((a: string) => achievements[a]),
            });
        } catch (e) {
            console.error(e);

            this.ui.showMain(true, {
                error: 'Could not load your rewards information',
            });
        }

        this.ui.hideLoading();
    }


    update(time: number, delta: number) {
        if (!this.snake.alive) {
            this.onOverlapped();
            return;
        }


        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        } else if (this.cursors.right.isDown) {
            this.snake.faceRight();
        } else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        } else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }

        if (this.snake.update(time)) {

            if (this.snake.collideWithFood(this.food)) {
                this.score++; // Zwiększ liczbę punktów
                this.ui.setScore(this.score);
                this.repositionFood();
            }
        }
    }

    repositionFood() {

        var testGrid = [];

        for (var y = 0; y < 37; y++) {
            testGrid[y] = [];

            for (var x = 0; x < 24; x++) {
                testGrid[y][x] = true;
            }
        }

        this.snake.updateGrid(testGrid);

        var validLocations = [];

        for (var y = 0; y < 30; y++) {
            for (var x = 0; x < 40; x++) {
                if (testGrid[y][x] === true) {
                    validLocations.push({ x: x, y: y });
                }
            }
        }

        if (validLocations.length > 0) {
            var pos = Phaser.Math.RND.pick(validLocations);

            this.food.setPosition(pos.x * 16, pos.y * 16);

            return true;
        }
        else {
            return false;
        }

    }
}
\



