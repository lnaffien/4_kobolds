import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  private phaserGame!: Phaser.Game;

  constructor() {}

  ngOnInit(): void {
    // Create a new Phaser game instance
    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: new GameScene(), // Use a custom Scene class
      parent: 'game-container', // Match the HTML element ID
      backgroundColor: '#1d1d1d'
    });
  }
}

// Define a custom Phaser Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Load assets here
    this.load.image('logo', 'assets/sky.png');
  }

  create(): void {
    // Add game objects here
    this.add.image(400, 300, 'logo');
  }
}
