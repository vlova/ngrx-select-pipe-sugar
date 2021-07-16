import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';
import { counterReducer } from './counter/counter.reducers';
import { NgrxUtilsModule } from './ngrx-utils/ngrx-utils.module';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ count: counterReducer }),
    NgrxUtilsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
