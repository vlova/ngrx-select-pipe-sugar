import { NgModule } from '@angular/core';

import { SelectPipe } from './select.pipe';
import { Select2Pipe } from './select2.pipe';

@NgModule({
    declarations: [
        SelectPipe,
        Select2Pipe,
    ],
    imports: [
    ],
    exports: [
        SelectPipe,
        Select2Pipe,
    ],
    providers: [],
    bootstrap: []
})
export class NgrxUtilsModule { }
