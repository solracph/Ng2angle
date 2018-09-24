import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialTablePaginatorFilter } from './material-table-paginator-filter.component';


@NgModule({
    imports:[
        SharedModule
    ],
    declarations: [
        MaterialTablePaginatorFilter
    ],
    exports: [
        MaterialTablePaginatorFilter
    ]
})

export class MaterialTablePaginatorFilterModule {}