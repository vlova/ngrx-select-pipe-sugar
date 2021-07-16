import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';
import * as counterSelectors from './counter.selectors';


@Component({
  selector: 'app-counter',
  template: `
     <div class="counter">Current Count: <span class="counter__number">{{ counterSelectors.getCount | select }}</span></div>
     <div class="counter">Current Count: <span class="counter__number">{{ counterSelectors.makeGetCountAdjusted | select2:2 }}</span></div>

     <button class="button" (click)="increment()">Increment</button>
     <button class="button" (click)="decrement()">Decrement</button>
     <button class="button" (click)="reset()">Reset Counter</button>
`,
  styleUrls: ['./counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  counterSelectors = counterSelectors;

  constructor(private store: Store<any>) { }

  public increment() {
    this.store.dispatch(increment());
  }

  public decrement() {
    this.store.dispatch(decrement());
  }

  public reset() {
    this.store.dispatch(reset());
  }
}
