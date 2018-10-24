import { Injectable } from '@angular/core';
import { SelectionModel} from '@angular/cdk/collections';
import * as _ from 'lodash';

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

    isAllFilterValueSelected(selection,dataSource){
        const numSelected = this.getFilterdataSelection(selection,dataSource).length;
        const numRows = dataSource.filteredData.length;
        return numSelected === numRows;
    }

    masterToggle(selection,dataSource) {
        this.isAllSelected(selection,dataSource) ?
            selection.clear() :
            dataSource.data.forEach(row => selection.select(row));
    }

    selectfilterValue(selection: SelectionModel<any>,dataSource){
        this.isAllFilterValueSelected(selection,dataSource) 
            ? dataSource.filteredData.forEach(row => selection.deselect(row))
            : dataSource.filteredData.forEach(row => selection.select(row))
    }

    deselectfilterValue(selection){
        selection.clear();
    }

    getFilterdataSelection(selection,dataSource){
        var newSelection = [];
        dataSource.filteredData.forEach(element => {
            var e = _.find(selection.selected,element);
            if(e != undefined){
                newSelection.push(e);
            }
            
        });
        return newSelection;
    }

    applyFilter(filterValue: string, dataSource) {
        dataSource.filter = filterValue.trim().toLowerCase();
    }
}