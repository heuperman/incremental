import {Component, Input, OnInit} from '@angular/core';
import { GameDataService } from '../game-data.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {
  title = 'incremental health';
  @Input()
  stress: number;

  constructor(public gameDataService: GameDataService) { }

  ngOnInit() {
  }

}
