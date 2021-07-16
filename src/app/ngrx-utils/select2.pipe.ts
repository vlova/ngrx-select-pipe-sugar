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
    mapFn: ForcedParameterlessSelector<TSelectedState>
  ): TSelectedState
  transform<TSelectedState, TSelectorProps extends any[], TSelectorArgs extends TSelectorProps>(
    mapFn: (...args: TSelectorProps) => (state: any) => TSelectedState,
    ...args: TSelectorArgs
  ): TSelectedState
  transform<TArgs extends any[]>(
    mapFn: any,
    ...args: TArgs
  ): any | null {
    const state$ = this.getMappedState$<TArgs>(args, mapFn);
    return this.asyncPipe.transform(state$);
  }

  private getMappedState$<TArgs extends any[]>(args: TArgs, mapFn: any) {
    let state$: Observable<any>;
    if (args.length === 0) {
      const typedMapFn = mapFn as (state: any) => any;
      state$ = this.store.select(typedMapFn);
    } else {
      const typedMapFn = mapFn as (...props: any[]) => (state: any) => any;
      state$ = this.store.select(this.getMemoizedSelector(typedMapFn, args));
    }
    return state$;
  }

  private memoizedCacheKey: string | undefined;
  private memoizedSelector: ((state: any) => any) | undefined;

  private getMemoizedSelector<TArgs extends any[]>(
    typedMapFn: (...args: TArgs) => (state: any) => any,
    args: TArgs
  ): (state: any) => any {
    const cacheKey = JSON.stringify(args);
    if (this.memoizedCacheKey !== cacheKey) {
      this.memoizedSelector = typedMapFn(...args);
    }

    return this.memoizedSelector!;
  }
}

