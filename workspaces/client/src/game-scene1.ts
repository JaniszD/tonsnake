import * as Phaser from 'phaser';
import { UI } from './ui';
import { BG_HEIGHT, COLUMN_ACCEL, COLUMN_TIME_ACCEL, FLAP_THRESH, GAME_HEIGHT, GAME_WIDTH, GAP_END, GAP_MAX, GAP_MIN, GAP_START, GRAVITY, INITIAL_COLUMN_INTERVAL, INITIAL_COLUMN_VELOCITY, JUMP_COOLDOWN, JUMP_VEL, PIPE_HEIGHT, PIPE_SCALE, PIPE_WIDTH } from './consts';
import GameScene from './game-scene'
import 'phaser';

var config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 640,
    backgroundColor: '#bfcc00',
    parent: 'phaser-snake',
    scene: [GameScene,]
}

export function boot() {
    return new Phaser.Game(config);
}

boot();
