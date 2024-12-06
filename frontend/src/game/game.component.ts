import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { Building } from './buildings'; // Adjust the path as needed

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  private phaserGame!: Phaser.Game;
  private bagOffsetPercentage = { x: 0.1, y: 0.4 }; // 10% of column width and 20% of column height
  public WinThreshold: number = 10000; // The goal threshold for winning

  // Game counters
  public recycledWaste: number = 0;
  public recycledWastePerSecond: number = 0;

  // Buildings
  public recyclingFactory: Building;
  public netsmall: Building;
  public netbig: Building;

  private readonly UPDATE_INTERVAL_MS = 25; // Update interval in milliseconds
  private readonly UPDATES_PER_SECOND = 1000 / this.UPDATE_INTERVAL_MS; // Number of updates per second

  private sharkSprite!: Phaser.GameObjects.Sprite;
  private columnWidths: number[] = [0.2, 0.5, 0.3]; // Initial percentages
  private readonly MAX_COLUMN1_WIDTH_RATIO = 0.2; // Max width for column 1 in percentage
  private readonly MIN_COLUMN_WIDTH_RATIO = 0.15; // Minimum column width as 15%
  private columnBackgrounds: Phaser.GameObjects.Image[] = [];
  private separators: Phaser.GameObjects.Image[] = [];
  private columnContents: Phaser.GameObjects.Image[][] = [[], [], []];
  private scrollOffsets: number[] = [0, 0, 0]; // Horizontal scroll offsets for each column

  constructor() {
    this.netsmall = new Building(10, 10); // Costs 10, generates 1 waste/sec
    this.netbig = new Building(50, 25); // Costs 100, generates 10 wastes/sec
    this.recyclingFactory = new Building(100, 50); // Costs 500, generates 50 wastes/sec
  }

  ngOnInit(): void {
  
    this.createGame();
    window.addEventListener('resize', this.handleResize.bind(this));

    // Wait for the game container to initialize, then update the layout
    setTimeout(() => {
      this.updateColumnsAndContents(window.innerWidth);
    }, 0);

    setInterval(this.updateRecycledWaste.bind(this), this.UPDATE_INTERVAL_MS); // Update recycled wastes every 25ms
    setInterval(this.updateRecycledWaste.bind(this.updateTint()), this.UPDATE_INTERVAL_MS); // Update recycled wastes every 25ms
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private popupVisible: boolean = false; // Add a flag to track popup visibility

private updateRecycledWaste(): void {
  // Calculate the amount to add based on the updates per second
  const increment = this.recycledWastePerSecond / this.UPDATES_PER_SECOND;
  this.recycledWaste = this.recycledWaste + increment;

  // Check if the threshold has been reached or exceeded
  if (this.recycledWaste >= this.WinThreshold && !this.popupVisible) {
    // Pause the game or any relevant updates
    this.phaserGame.scene.pause('default'); // Use the scene key 'default'

    // Display the congratulatory popup
    this.showCongratsPopup();

  this.recycledWastePerSecond = 0;
  }
}

private showCongratsPopup(): void {
  this.popupVisible = true; // Set the flag to true to prevent multiple popups

  // Create a simple popup element
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.padding = '20px';
  popup.style.backgroundColor = '#fff';
  popup.style.color = '#000';
  popup.style.border = '2px solid #000';
  popup.style.borderRadius = '10px';
  popup.style.zIndex = '1000';
  popup.style.textAlign = 'center';
  popup.innerHTML = `
    <h2>Congratulations, you saved the oceans and yourself!</h2>
    <p>You reached the recycling goal of ${this.WinThreshold}! bags</p>
    <button id="reset-btn" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Reset</button>
  `;

  // Add the popup to the document
  document.body.appendChild(popup);

  // Add an event listener to the reset button
  const resetButton = document.getElementById('reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Reset the scores, hide the popup, and remove the popup element
      this.recycledWaste = 0;
      this.recycledWastePerSecond = 0;
      this.popupVisible = false; // Reset the flag
      document.body.removeChild(popup);

      // Resume the game
      this.phaserGame.scene.resume('default'); // Use the scene key 'default'
    });
  }
}

  private updateTint(): void {
    // Loop through each organ image
    this.column1Images.forEach((organ) => {
      if (organ.image) {
        // Calculate progress from 0 to 1
        const progress = Math.min(this.roundedRecycledWaste / this.WinThreshold, 1);
  
        // Start and end colors
        const startColor = Phaser.Display.Color.ValueToColor(0x323232); // Dark gray
        const endColor = Phaser.Display.Color.ValueToColor(0x00ff00); // Green
  
        // Interpolate colors
        const tintColor = Phaser.Display.Color.Interpolate.ColorWithColor(
          startColor,
          endColor,
          100, // Steps
          progress * 100 // Current step
        );
  
        // Convert interpolated color back to hex
        const finalColor = Phaser.Display.Color.GetColor(tintColor.r, tintColor.g, tintColor.b);
  
        // Apply tint to the organ
        organ.image.setTint(finalColor);
      }
    });
  }  
  
  get roundedRecycledWaste(): number {
    return Math.round(this.recycledWaste);
  }

  buyBuilding(building: Building): void {
    const result = building.buy(this.recycledWaste);
    if (result.success) {
      this.recycledWaste = result.newrecycledWaste;
  
      // Recalculate the recycledWastePerSecond after a purchase
      this.recalculateRecycledWastePerSecond();
    }
  }
  
  private recalculateRecycledWastePerSecond(): void {
    this.recycledWastePerSecond =
      this.recyclingFactory.getProduction() +
      this.netsmall.getProduction() +
      this.netbig.getProduction();
  }

  canAfford(building: Building): boolean {
    return this.recycledWaste >= building.cost;
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
      },
      pixelArt: true,
    });
  }

  private preload(): void {
    const scene = this.phaserGame.scene.getScene('default');
    scene.load.image('column1', '../assets/sprites/exports/human/body_healthy_128x64.png');
    scene.load.image('column1_bckgnd', '../assets/sprites/exports/human/human_background.png');
    scene.load.image('column1_Kidney', '../assets/sprites/exports/human/kidney_healthy_64x64.png');
    scene.load.image('column1_Heart', '../assets/sprites/exports/human/heart_healthy_64x64.png');
    scene.load.image('column1_Lungs', '../assets/sprites/exports/human/lungs_healthy_64x64.png');
    scene.load.image('column1_Stomac', '../assets/sprites/exports/human/stomac_healthy_64x64.png');
    scene.load.image('column2', '../assets/sprites/exports/sea/sea_healthy_background_128x192.png');
    scene.load.image('column3', '../assets/sprites/exports/ui/background_upgrades_64x128.png');
    scene.load.image('separator', '../assets/sprites/exports/ui/separator_32x128.png');
    scene.load.image('bag', '../assets/sprites/exports/sea/trashbag_64x64.png');
     // New sea assets
    // Shark sprite
    scene.load.spritesheet('shark_saw', '../assets/sprites/exports/sea/shark_saw_spreadsheet_48x32.png', {
      frameWidth: 48,
      frameHeight: 32,
    });
  }

  private initialColumnWidth!: number;
  private column1Images: { 
    name: string; 
    offset: { x: number; y: number }; 
    image: Phaser.GameObjects.Image; 
    scale: number; // Add this property
  }[] = [];  

  private bagImage!: Phaser.GameObjects.Image;
  private initialColumn1Width!: number;
  private create(): void {
    const scene = this.phaserGame.scene.getScene('default');
    const width = this.phaserGame.scale.width;
    const height = this.phaserGame.scale.height;
  
    this.columnWidths.forEach((percentage, index) => {
      const columnWidth = percentage * width;
      const columnX = this.calculateColumnX(index, width);
  
      if (index === 0) {
        // Add background for column 1
        const column1Background = scene.add.image(columnX, 0, 'column1_bckgnd')
          .setOrigin(0, 0)
          .setDisplaySize(columnWidth, height)
          .setDepth(-1);
        column1Background.name = 'column1_bckgnd';
        this.initialColumn1Width = columnWidth; // Store the initial width of column 1
  
        // Add additional images for column 1
        const images = [
          { name: 'column1_Stomac', offset: { x: 0, y: -60 }, scale: 0.8 },
          { name: 'column1_Kidney', offset: { x: 5, y: -20 }, scale: 1.25 },
          { name: 'column1_Lungs', offset: { x: 5, y: -120 }, scale: 1.5 },
          { name: 'column1_Heart', offset: { x: 10, y: -100 }, scale: 1.2 }
        ];        
  
        images.forEach((img) => {
          const image = scene.add.image(
            columnX + columnWidth / 2 + img.offset.x,
            height / 2 + img.offset.y,
            img.name
          )
            .setOrigin(0.5, 0.5)
            .setAlpha(1)
            .setTint(0xffffff)
            .setDepth(1);
          this.column1Images.push({ ...img, image });
          image.setScale(img.scale);
        });
      }  
  
      if (index === 1) {
        const bagOffset = { x: 50, y: 210 }; // Adjust the x and y offsets as needed

        // Add the bag to column 2
        this.bagImage = scene.add.image(columnX + columnWidth / 2 + this.bagOffsetPercentage.x * columnWidth, height / 2 + this.bagOffsetPercentage.y * height, 'bag')
          .setOrigin(0.5, 0.5)
          .setDepth(1)
          .setInteractive() // Make it interactive
          .setScale(1); // Default scale
  
        // Bag click effects
        this.bagImage.on('pointerdown', () => {
          this.bagImage.setScale(0.75); // Scale down
        });
  
        this.bagImage.on('pointerup', () => {
          this.bagImage.setScale(1); // Scale back to normal
          this.recycledWaste += 1; // Add +1 to recycledWaste
        });
  
        this.bagImage.on('pointerout', () => {
          this.bagImage.setScale(1); // Reset scale if pointer leaves the image
        });
        // Add shark sprite to column 2
        const shark = scene.add.sprite(
          columnX + columnWidth / 2,
          height / 2,
          'shark_saw'
        )
          .setOrigin(0.5, 0.5)
          .setScale(columnWidth / 500) // Adjust scale dynamically based on column width
          .setDepth(1); // Set depth for correct layering

        // Define shark animation
        scene.anims.create({
          key: 'swim',
          frames: scene.anims.generateFrameNumbers('shark_saw', { start: 0, end: 3 }),
          frameRate: 6, // Adjust the frame rate for smooth animation
          repeat: -1, // Loop infinitely
        });

        // Play the shark animation
        shark.play('swim')
      }
      
      // Add main column background
      const columnBackground = scene.add.image(columnX, 0, `column${index + 1}`)
        .setOrigin(0, 0)
        .setDisplaySize(columnWidth, height);
      this.columnBackgrounds.push(columnBackground);
    });
  
    for (let i = 0; i < 2; i++) {
      const separatorX = this.calculateSeparatorX(i, width);
  
      const separator = scene.add.image(separatorX, height / 2, 'separator')
        .setInteractive()
        .setOrigin(0.5)
        .setDisplaySize(10, height)
        .setDepth(5);
  
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
  
      // Update images for column 1
      if (index === 0) {
        const column1Background = column.scene.children.getByName('column1_bckgnd') as Phaser.GameObjects.Image;
        if (column1Background) {
          column1Background.setPosition(columnX, 0);
          column1Background.setDisplaySize(columnWidth, height);
        }

        // Compute scaleFactor relative to the initial width
        const scaleFactor = columnWidth / this.initialColumn1Width;

        this.column1Images.forEach(({ offset, image, scale }) => {
          const baseScale = scale || 1; 
          image.setPosition(columnX + columnWidth / 2 + offset.x, height / 2 + offset.y);
          image.setScale(baseScale * scaleFactor); // Use the initial baseline scaling
          this.updateTint();
        });
      }

      if (index === 1) {
        // Update bag position and scale with offset
        const bagOffset = { x: 50, y: 210 }; // Use the same offset defined earlier
        if (this.bagImage) {
          this.bagImage.setPosition(columnX + columnWidth / 2 + this.bagOffsetPercentage.x * columnWidth, height / 2 + this.bagOffsetPercentage.y * height);
          this.bagImage.setScale(columnWidth / 800); // Adjust scale dynamically
        }

        // Update shark sprite position and scale
        if (this.sharkSprite) {
          this.sharkSprite.setPosition(
            columnX + columnWidth / 2,
            height / 2
          );
          this.sharkSprite.setScale(columnWidth / 500); // Adjust scale dynamically
        }
      }      

      // Update buttons for column 3
      if (index === 2) {
        const buttonsContainer = document.querySelector('.building-buttons') as HTMLElement;
        if (buttonsContainer) {
          const columnX = this.calculateColumnX(2, canvasWidth); // For column 3 (index 2)
          const columnWidth = this.columnWidths[2] * canvasWidth;
        
          const height = this.phaserGame.scale.height;
          // Position the container at the center of column 3
          buttonsContainer.style.left = `${columnX + columnWidth / 2}px`;
          buttonsContainer.style.top = `${height / 2}px`;
          buttonsContainer.style.transform = 'translate(-50%, -50%)';
        }        
      }
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

  private update(): void {this.updateTint();}
}
