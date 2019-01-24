import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatListModule,
  MatToolbarModule
} from '@angular/material';
import { GetButtonComponent } from './get-button/get-button.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { FactoriesListComponent } from './factories-list/factories-list.component';
import { UpgradesListComponent } from './upgrades-list/upgrades-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GetButtonComponent,
    TitleBarComponent,
    FactoriesListComponent,
    UpgradesListComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatGridListModule,
    MatListModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }