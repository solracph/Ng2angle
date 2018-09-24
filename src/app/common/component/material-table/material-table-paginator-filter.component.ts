import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator,MatTableDataSource, MatStepper } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { MaterialTableHelper } from '../../service/material-table-helper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

 


@Component({
  selector: 'material-table-paginator-filter',
  templateUrl: 'material-table-paginator-filter.component.html',
  styleUrls:[ 'material-table-paginator-filter.component.scss' ]
})
export class MaterialTablePaginatorFilter {

    @Input() dataSource: MatTableDataSource<any> ;
    @Input() selection: SelectionModel<any>;
    @Input() pageSizeOptions: Array<number>;
    @ViewChild('paginator') paginator: MatPaginator; 

    public newFilterFormGroup: FormGroup;

    constructor ( 
        public materialTableHelper: MaterialTableHelper,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(){

        this.dataSource.paginator = this.paginator;
        this.newFilterFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['',Validators.required]
        });
    }

    isAllSelected() {
        return this.materialTableHelper.isAllSelected(this.selection,this.dataSource)
    }

    masterToggle() {
        this.materialTableHelper.masterToggle(this.selection,this.dataSource);
    }

    applyFilter(filterValue: string) {
        this.materialTableHelper.applyFilter(filterValue,this.dataSource);
    }
}