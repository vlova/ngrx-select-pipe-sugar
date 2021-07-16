import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

type ForcedParameterlessSelector<TState> = TState extends Function
  ? 'This error typically happens when you have selector factory & forget to pass argument to it'
  : (state: any) => TState;

@Pipe({ name: 'select2', pure: false })
export class Select2Pipe implements PipeTransform {
  constructor(private store: Store<unknown>, private _ref: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(this._ref);
  }

  private asyncPipe: AsyncPipe;

  ngOnDestroy() {
    this.asyncPipe.ngOnDestroy();
  }

  transform<TSelectedState>(
    selector: ForcedParameterlessSelector<TSelectedState>
  ): TSelectedState
  transform<TSelectedState, TSelectorProps extends any[], TSelectorArgs extends TSelectorProps>(
    selectorFactory: (...args: TSelectorProps) => (state: any) => TSelectedState,
    ...args: TSelectorArgs
  ): TSelectedState
  transform<TArgs extends any[]>(
    selectorOrFactory: any,
    ...args: TArgs
  ): any | null {
    const state$ = this.getMappedState$<TArgs>(selectorOrFactory, args);
    return this.asyncPipe.transform(state$);
  }

  private mappedState$Cache = new LRUCache<Function, Observable<any>>();
  private getMappedState$<TArgs extends any[]>(mapFn: Function, args: TArgs) {
    let selector = this.getOrMakeSelector<TArgs>(mapFn, args);
    return this.mappedState$Cache.getOrAdd(mapFn, () => this.store.select(selector));
  }

  private getOrMakeSelector<TArgs extends any[]>(selectorOrFactory: Function, args: TArgs) {
    if (args.length === 0) {
      return selectorOrFactory as (state: any) => any;
    } else {
      return this.makeSelectorInternal(selectorOrFactory as any, args);
    }
  }

  private selectorCache = new LRUCache<string, (state: any) => any>();
  private makeSelectorInternal<TArgs extends any[]>(
    selectorFactory: (...args: TArgs) => (state: any) => any,
    args: TArgs
  ): (state: any) => any {
    return this.selectorCache.getOrAdd(JSON.stringify(args), () => selectorFactory(...args));
  }
}


class LRUCache<TKey, TValue> {
  private seenKey: TKey | undefined;
  private seenValue: TValue | undefined;

  getOrAdd(key: TKey, valueFactory: () => TValue) {
    if (this.seenKey !== key) {
      this.seenValue = valueFactory();
    }

    return this.seenValue!;
  }
}