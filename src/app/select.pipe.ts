import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';

@Pipe({ name: 'select', pure: false })
export class SelectPipe implements PipeTransform {
  constructor(private store: Store<any>, private _ref: ChangeDetectorRef) {
    this.asyncPipe = new AsyncPipe(this._ref);
  }

  private asyncPipe: AsyncPipe;

  ngOnDestroy() {
    this.asyncPipe.ngOnDestroy();
  }

  transform(selector: any) {
    const state$ = this.store.select(selector);
    return this.asyncPipe.transform(state$);
  }
}
