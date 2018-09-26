
import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Application } from '../models/application.model';
import { MaterialTableHelper } from '../../../../common/service/material-table-helper.service';

@Component({
    selector: 'dialog-edit-constraints',
    templateUrl: 'dialog-edit-constraints.component.html',
    styleUrls: ['dialog-edit-constraints.component.scss']
  })
  export class DialogEditConstraintsComponent {

    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 

    public selection: SelectionModel<Application>; 
    public dataSource: MatTableDataSource<Application>;
    public headerCell: string;
    
    constructor(
        public dialogRef: MatDialogRef<DialogEditConstraintsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper
    ) {}
    

    ngOnInit(){
        this.headerCell = this.data.headerCell;
        this.dataSource = new MatTableDataSource<Application>(this.data.dataSource);
        this.dataSource.paginator = this.applicationPaginator;
        this.selection = new SelectionModel<Application>(true, this.data.selection);
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSelect(selection) {
        this.selection =  selection;
    }

    onSave(){
        if(this.selection.selected.length > 0){
            this.dialogRef.close({ selection: this.selection,dataSource: this.dataSource});
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