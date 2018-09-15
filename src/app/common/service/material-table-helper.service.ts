import { Injectable } from '@angular/core';

@Injectable()
export 
    class MaterialTableHelper
{
    constructor () {};

    isAllSelected(selection,dataSource) {
        const numSelected = selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(selection,dataSource) {
        this.isAllSelected(selection,dataSource) ?
            selection.clear() :
            dataSource.data.forEach(row => selection.select(row));
    }

    applyFilter(filterValue: string, dataSource) {
        dataSource.filter = filterValue.trim().toLowerCase();
    }
}