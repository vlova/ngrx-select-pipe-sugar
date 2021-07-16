import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Pipe({ name: 'select', pure: false })
export class SelectPipe implements PipeTransform {
  constructor(private store: Store, private _ref: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(this._ref);
  }

  private asyncPipe: AsyncPipe;

  ngOnDestroy() {
    this.asyncPipe.ngOnDestroy();
  }

  transform<TSelectedState>(selector: (state: any) => TSelectedState): TSelectedState {
    const state$ = this.getMappedState$<TSelectedState>(selector);
    return this.asyncPipe.transform(state$)!;
  }


  private mappedState$Cache = new LRUCache<Function, Observable<any>>();
  private getMappedState$<TSelectedState>(selector: (state: any) => TSelectedState) {
    return this.mappedState$Cache.getOrAdd(selector, () => this.store.select(selector));
  }
}

class LRUCache<TKey, TValue> {
  private seenKey: TKey | undefined;
  private seenValue: TValue | undefined;

  getOrAdd(key: TKey, valueFactory: () => TValue) {
    if (this.seenKey !== key) {
      this.seenKey = key;
      this.seenValue = valueFactory();
    }

    return this.seenValue!;
  }
}