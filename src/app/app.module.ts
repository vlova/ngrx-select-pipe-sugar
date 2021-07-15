import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { CounterComponent } from './counter/counter.component';
import { counterReducer } from './counter/counter.reducers';
import { SelectPipe } from './select.pipe';

@NgModule({
  declarations: [AppComponent, CounterComponent, SelectPipe],
  imports: [BrowserModule, StoreModule.forRoot({ count: counterReducer })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
