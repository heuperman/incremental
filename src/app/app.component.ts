import {Component, HostListener, OnInit} from '@angular/core';
import {GameDataService} from './services/game-data.service';
import {GameData} from './interfaces/game-data';
import {SideHustleService} from './services/side-hustle.service';
import {Upgrade} from './interfaces/upgrade';
import {Multipliers} from './interfaces/multipliers';
import {UpgradeService} from './services/upgrade.service';
import {VictoryDialogComponent} from './victory-dialog/victory-dialog.component';
import {MatDialog} from '@angular/material';
import {defaultValues} from './default-values';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private gameData: GameData;

  constructor(
    private gameDataService: GameDataService,
    private sideHustleService: SideHustleService,
    private upgradeService: UpgradeService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.gameData = this.gameDataService.getGameData();
    this.startProduction();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    this.gameDataService.saveGameData(this.gameData);
  }

  getScore(): number {
    return this.gameDataService.getScore();
  }

  getStress(): number {
    return this.gameDataService.getStress();
  }

  startProduction() {
    setInterval(() => {
      this.gameData.score += this.calculateProduction() / 10;
      this.gameData.stressReduction -= this.calculateStressIncrease() / 10;
      this.checkAvailability();
      this.isVictoryAchieved();
    }, 100);
  }

  isBurnout(): boolean {
    const burnout =  this.gameData.stressReduction < 0;
    if (burnout) { this.resetHoursWorked(); }
    return burnout;
  }

  calculateProduction(): number {
    let production = 0;
    for (const sideHustle of this.sideHustleService.getSideHustles()) {
      const index = this.sideHustleService.getSideHustleIndex(sideHustle);
      production += sideHustle.baseProduction
        * this.getMultiplier(index)
        * this.gameData.hoursWorkedPerSideHustle[index];
    }
    return production;
  }

  getMultiplier(sideHustleIndex: number): number {
    const upgradesToApply: Upgrade[] = [];
    for (const upgradeId of this.gameData.upgradesPurchased) {
      upgradesToApply.push(this.upgradeService.getUpgrades().find(upgrade => upgrade.id === upgradeId));
    }
    const upgrades = upgradesToApply ? upgradesToApply.filter(upgrade => upgrade.target === sideHustleIndex) : [];
    return Multipliers.base * (upgrades.length * 2) || Multipliers.base;
  }

  calculateStressIncrease(): number {
    let stressIncrease = 0;
    const sideHustles = this.sideHustleService.getSideHustles();
    sideHustles.forEach((sideHustle, index) => {
      stressIncrease += sideHustle.baseProduction * this.gameData.hoursWorkedPerSideHustle[index];
    });
    return stressIncrease;
  }

  checkAvailability() {
    for (const upgrade of this.upgradeService.getUpgrades()) {
      if (!this.gameData.upgradesPurchased.includes(upgrade.id)
        && this.gameData.score >= upgrade.requiredFunds
        && !this.upgradeService.getAvailableUpgrades().includes(upgrade)) {
        this.upgradeService.addToAvailableUpgrades(upgrade);
      }
    }
  }

  resetHoursWorked() {
    const sideHustles = this.sideHustleService.getSideHustles();
    sideHustles.forEach((sideHustle, index) => {
      this.gameData.hoursWorkedPerSideHustle[index] = 0;
    });
  }

  isVictoryAchieved() {
    if (this.gameData.stressReduction >= defaultValues.baseStress && !this.gameData.victoryAchieved && !this.dialog.openDialogs.length) {
      this.showVictoryDialog();
    }
  }

  showVictoryDialog() {
    const dialogRef = this.dialog.open(VictoryDialogComponent, {
      height: 'auto',
      width: 'auto',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(reset => {
      if (reset) {
        this.gameData = this.gameDataService.resetGameData();
      } else {
        this.gameData.victoryAchieved = true;
      }
    });
  }
}
