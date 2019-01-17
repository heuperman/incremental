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
import { CountService } from './count.service';

@NgModule({
  declarations: [
    AppComponent,
    GetButtonComponent
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
    CountService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
