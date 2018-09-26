
import { Component, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Application } from '../models/application.model';
import { MaterialTableHelper } from '../../../../common/service/material-table-helper.service';

@Component({
    selector: 'dialog-rule-clone',
    templateUrl: 'dialog-rule-clone.component.html',
    styleUrls: ['dialog-rule-clone.component.scss']
  })
  export class DialogRuleCloneComponent {

    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 

    public applicationSelection: SelectionModel<Application> = new SelectionModel<Application>(true, []);
    public applicationDataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);
    public headerCell: string;
    public clonedRuleFormGroup: FormGroup;

    
    constructor(
        public dialogRef: MatDialogRef<DialogRuleCloneComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper,
        private _formBuilder: FormBuilder,
    ) {}
    

    ngOnInit(){
        this.headerCell = this.data.headerCell;
        this.clonedRuleFormGroup = this._formBuilder.group({
            descriptionCtrl:  [this.data.description,Validators.required]
        });


        this.applicationDataSource = new MatTableDataSource<Application>(this.data.applicationDataSource);
        this.applicationDataSource.paginator = this.applicationPaginator;
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(){
        if(this.clonedRuleFormGroup.value.descriptionCtrl != "" && this.applicationSelection.selected.length > 0){
            this.dialogRef.close({description: this.clonedRuleFormGroup.value.descriptionCtrl , applicationSelection: this.applicationSelection});
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