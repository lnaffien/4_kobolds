import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  private phaserGame!: Phaser.Game;
  private counter: number = 0; // Compteur de clics
  private counterText!: Phaser.GameObjects.Text; // Texte du compteur
  private debugBag!: Phaser.GameObjects.Image; // Bag statique
  private net!: Phaser.GameObjects.Sprite; // Net sprite
  private background!: Phaser.GameObjects.Image; // Image de fond

  private originalBagWidth: number = 0; // Largeur originale du bag
  private originalBagHeight: number = 0;
  private originalNetWidth: number = 0; // Largeur originale du net
  private originalNetHeight: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.createGame();

    // Ajoute un écouteur pour le redimensionnement
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    // Supprime l'écouteur lors de la destruction
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private createGame(): void {
    const container = document.getElementById('game-container');

    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: container?.clientWidth || window.innerWidth, // Largeur dynamique
      height: container?.clientHeight || window.innerHeight, // Hauteur dynamique
      parent: 'game-container',
      backgroundColor: '#9d1d1d',
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this)
      }
    });
  }

  private preload(): void {
    const scene = this.phaserGame.scene.getScene('default');
    // Charge les assets
    scene.load.image('sky', 'assets/sky.png'); // Fond
    scene.load.image('debugbag', 'assets/bag.png'); // Bag image statique
    scene.load.spritesheet('net_32x32', 'assets/net_32x32.png', {
      frameWidth: 32,
      frameHeight: 32
    }); // Net sprite
  }

  private create(): void {
    const scene = this.phaserGame.scene.getScene('default');
    const width = this.phaserGame.scale.width;
    const height = this.phaserGame.scale.height;

    // Ajouter le fond
    this.background = scene.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.resizeBackground(width, height);

    // Ajouter le debug bag
    this.debugBag = scene.add.image(width / 3, height / 2, 'debugbag')
      .setInteractive()
      .setScale(0.2);

    // Stocke la taille originale
    this.originalBagWidth = this.debugBag.width;
    this.originalBagHeight = this.debugBag.height;

    this.debugBag.on('pointerdown', () => {
      this.counter++;
      this.updateCounterText();
    });

    // Ajouter le net sprite
    this.net = scene.add.sprite(2 * width / 3, height / 2, 'net_32x32', 0)
      .setInteractive()
      .setScale(1);

    // Stocke la taille originale
    this.originalNetWidth = this.net.width;
    this.originalNetHeight = this.net.height;

    // Ajouter des animations pour le net
    scene.anims.create({
      key: 'net_spin',
      frames: scene.anims.generateFrameNumbers('net_32x32', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.net.on('pointerdown', () => {
      this.counter++;
      this.updateCounterText();
      this.net.play('net_spin'); // Animation sur clic
    });

    // Ajouter le texte du compteur
    this.counterText = scene.add.text(width - 10, 10, `Count: ${this.counter}`, {
      fontSize: '24px',
      color: '#ff0000',
      fontFamily: 'Arial'
    }).setOrigin(1, 0); // Aligner en haut à droite
  }

  private handleResize(): void {
    const container = document.getElementById('game-container');
    if (container) {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      // Redimensionne le canvas Phaser
      this.phaserGame.scale.resize(newWidth, newHeight);

      // Redimensionne les objets
      this.resizeBackground(newWidth, newHeight);

      if (this.debugBag) {
        this.debugBag.setPosition(newWidth / 3, newHeight / 2);
        const scaleX = newWidth / this.phaserGame.scale.width;
        const scaleY = newHeight / this.phaserGame.scale.height;
        this.debugBag.setScale(Math.min(scaleX, scaleY) * 0.2);
      }

      if (this.net) {
        this.net.setPosition(2 * newWidth / 3, newHeight / 2);
        const scaleX = newWidth / this.phaserGame.scale.width;
        const scaleY = newHeight / this.phaserGame.scale.height;
        this.net.setScale(Math.min(scaleX, scaleY) * 1);
      }

      if (this.counterText) {
        this.counterText.setPosition(newWidth - 10, 10);
      }
    }
  }

  private resizeBackground(width: number, height: number): void {
    if (this.background) {
      this.background.setScale(width / this.background.width, height / this.background.height);
    }
  }

  private updateCounterText(): void {
    this.counterText.setText(`Count: ${this.counter}`);
  }

  private update(): void {
    // Logique par frame (si nécessaire)
  }
}
