// src/app/models/building.ts

export class Building {
    public owned: number;
    public cost: number;
    public production: number; // Wastes generated per second
  
    constructor(public initialCost: number, public productionRate: number) {
      this.owned = 0;
      this.cost = initialCost;
      this.production = productionRate;
    }
  
    // Buy one building
    buy(recycledWaste: number): { success: boolean; newrecycledWaste: number } {
      if (this.cost <= recycledWaste) {
        recycledWaste -= this.cost;
        this.owned++;
        this.cost = Math.ceil(this.cost * 1.15); // Increase cost for next purchase
        return { success: true, newrecycledWaste: recycledWaste };
      }
      return { success: false, newrecycledWaste: recycledWaste };
    }
  
    // Total production from this building
    getProduction(): number {
      return this.owned * this.production;
    }
  }
  