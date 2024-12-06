import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  private phaserGame!: Phaser.Game;

  private columnWidths: number[] = [0.33, 0.34, 0.33]; // Initial percentages
  private columnBackgrounds: Phaser.GameObjects.Image[] = [];
  private separators: Phaser.GameObjects.Image[] = [];
  private columnContents: Phaser.GameObjects.Image[][] = [[], [], []];
  private readonly MIN_COLUMN_WIDTH_RATIO = 0.15; // Minimum column width as 15%

  constructor() {}

  ngOnInit(): void {
    this.createGame();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private createGame(): void {
    const container = document.getElementById('game-container');

    this.phaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: container?.clientWidth || window.innerWidth,
      height: container?.clientHeight || window.innerHeight,
      parent: 'game-container',
      backgroundColor: '#1d1d1d',
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this)
      }
    });
  }

  private preload(): void {
    const scene = this.phaserGame.scene.getScene('default');
    scene.load.image('column1', 'assets/column1.png');
    scene.load.image('column2', 'assets/column2.png');
    scene.load.image('column3', 'assets/column3.png');
    scene.load.image('separator', 'assets/separator.png');
    scene.load.image('item', 'assets/item.png');
  }

  private create(): void {
    const scene = this.phaserGame.scene.getScene('default');
    const width = this.phaserGame.scale.width;
    const height = this.phaserGame.scale.height;

    this.columnWidths.forEach((percentage, index) => {
      const columnWidth = percentage * width;
      const columnX = this.calculateColumnX(index, width);

      const columnBackground = scene.add.image(columnX, 0, `column${index + 1}`)
        .setOrigin(0, 0)
        .setDisplaySize(columnWidth, height);

      this.columnBackgrounds.push(columnBackground);

      const item = scene.add.image(
        columnX + columnWidth / 2,
        height / 2,
        'item'
      ).setScale(0.1);
      this.columnContents[index].push(item);
    });

    for (let i = 0; i < 2; i++) {
      const separatorX = this.calculateSeparatorX(i, width);

      const separator = scene.add.image(separatorX, height / 2, 'separator')
        .setInteractive()
        .setOrigin(0.5)
        .setDisplaySize(10, height);

      scene.input.setDraggable(separator);

      separator.on('drag', (pointer: Phaser.Input.Pointer, dragX: number) => {
        this.handleSeparatorDrag(i, dragX, this.phaserGame.scale.width);
      });

      this.separators.push(separator);
    }
  }

  private handleSeparatorDrag(separatorIndex: number, dragX: number, canvasWidth: number): void {
    const minColumnWidth = this.MIN_COLUMN_WIDTH_RATIO * canvasWidth;

    const leftColumnStart = this.calculateColumnX(separatorIndex, canvasWidth);
    const rightColumnEnd = this.calculateColumnX(separatorIndex + 2, canvasWidth);

    const clampedX = Phaser.Math.Clamp(
      dragX,
      leftColumnStart + minColumnWidth,
      rightColumnEnd - minColumnWidth
    );

    const leftColumnWidth = (clampedX - leftColumnStart) / canvasWidth;
    const rightColumnWidth = (rightColumnEnd - clampedX) / canvasWidth;

    if (
      leftColumnWidth >= this.MIN_COLUMN_WIDTH_RATIO &&
      rightColumnWidth >= this.MIN_COLUMN_WIDTH_RATIO
    ) {
      this.columnWidths[separatorIndex] = leftColumnWidth;
      this.columnWidths[separatorIndex + 1] = rightColumnWidth;
    }

    this.updateColumnsAndContents(canvasWidth);
  }

  private calculateColumnX(index: number, canvasWidth: number): number {
    return this.columnWidths.slice(0, index).reduce((acc, w) => acc + w * canvasWidth, 0);
  }

  private calculateSeparatorX(separatorIndex: number, canvasWidth: number): number {
    return this.calculateColumnX(separatorIndex + 1, canvasWidth);
  }

  private updateColumnsAndContents(canvasWidth: number): void {
    const height = this.phaserGame.scale.height;

    this.columnBackgrounds.forEach((column, index) => {
      const columnX = this.calculateColumnX(index, canvasWidth);
      const columnWidth = this.columnWidths[index] * canvasWidth;

      column.setPosition(columnX, 0);
      column.setDisplaySize(columnWidth, height);

      this.columnContents[index].forEach((item) => {
        item.setPosition(columnX + columnWidth / 2, height / 2);
        item.setScale(columnWidth / 800);
      });
    });

    this.separators.forEach((separator, index) => {
      const separatorX = this.calculateSeparatorX(index, canvasWidth);
      separator.setPosition(separatorX, height / 2);
    });
  }

  private handleResize(): void {
    const container = document.getElementById('game-container');
    if (!container) return;

    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    this.phaserGame.scale.resize(newWidth, newHeight);

    const minWidth = this.MIN_COLUMN_WIDTH_RATIO * newWidth;

    this.columnWidths = this.columnWidths.map((widthRatio) => {
      const absoluteWidth = widthRatio * newWidth;
      if (absoluteWidth < minWidth) {
        return minWidth / newWidth;
      }
      return widthRatio;
    });

    const totalWidth = this.columnWidths.reduce((sum, w) => sum + w, 0);
    if (totalWidth > 1) {
      const excessWidth = totalWidth - 1;
      this.columnWidths[1] -= excessWidth;
    }

    this.updateColumnsAndContents(newWidth);
  }

  private update(): void {
    // Optional update logic
  }
}
