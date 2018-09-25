
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

    public selection: SelectionModel<Application> = new SelectionModel<Application>(true, []);
    public dataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);

    
    constructor(
        public dialogRef: MatDialogRef<DialogEditConstraintsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper
    ) {}
    

    ngOnInit(){
        this.dataSource = new MatTableDataSource<Application>(this.data.dataSource);
        this.dataSource.paginator = this.applicationPaginator;
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(){
        if(this.selection.selected.length > 0){
            this.dialogRef.close({ selection: this.selection});
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