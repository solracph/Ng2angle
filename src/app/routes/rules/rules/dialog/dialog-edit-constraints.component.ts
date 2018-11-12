
import { Component, Inject } from '@angular/core';
import {MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MaterialTableHelper } from '../../../../common/service/material-table-helper.service';

@Component({
    selector: 'dialog-edit-constraints',
    templateUrl: 'dialog-edit-constraints.component.html',
    styleUrls: ['dialog-edit-constraints.component.scss']
  })
  export class DialogEditConstraintsComponent {


    public selection: SelectionModel<any>; 
    public dataSource: MatTableDataSource<any>;
    public headerCell: string;
    
    constructor(
        public dialogRef: MatDialogRef<DialogEditConstraintsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper
    ) {}
    

    ngOnInit(){
        this.headerCell = this.data.headerCell;
        this.dataSource = new MatTableDataSource<any>(this.data.dataSource);
        this.selection = new SelectionModel<any>(true, this.data.selection);
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSelect(selection) {
        this.selection =  selection;
    }

    onSave(){
        if(this.selection.selected.length > 0){
            var _selection;
            /*if(this.selection.selected.length == this.dataSource.data.length){
                _selection = new SelectionModel<any>(true, [{
                    type: this.dataSource.data[0].type,
                    name: "All"
                }]);*/
            /*}else{*/
                _selection = this.selection;
            /*}*/
            this.dialogRef.close({ selection: _selection,dataSource: this.dataSource});
        }
    }

    isAllSelected(selection,dataSource) {
        return this.materialTableHelper.isAllSelected(selection,dataSource)
    }

    masterToggle(selection,dataSource) {
        this.materialTableHelper.masterToggle(selection,dataSource);
    }

    applyFilter(filterValue: string, dataSource) {
        this.materialTableHelper.applyFilter(filterValue,dataSource);
    }
}