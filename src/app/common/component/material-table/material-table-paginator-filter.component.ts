import { Component, Input, ViewChild, Output, EventEmitter, } from '@angular/core';
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
    @Input() headerCell: string;
    @Output() selected = new EventEmitter<any>();
    @ViewChild('paginator') paginator: MatPaginator; 

    public newFilterFormGroup: FormGroup;


    constructor ( 
        public materialTableHelper: MaterialTableHelper,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(){

        if(this.selection.selected.length > 0){
            var selection = [];
            this.dataSource.data.forEach(element => {
                this.selection.selected.forEach(selected => {
                    if(element.id == selected.id || selected.name == "All"){
                        selection.push(element)
                    }
                })
            });
            this.selection = new SelectionModel<any>(true, selection);
        }
        this.dataSource.paginator = this.paginator;
        this.newFilterFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['',Validators.required]
        });
        
    }

    select(selection){
        this.selected.emit(selection);
    }

    isAllSelected() {
        this.select(this.selection);
        return this.materialTableHelper.isAllSelected(this.selection,this.dataSource);
        
    }

    masterToggle() {
        this.select(this.selection);
        this.materialTableHelper.masterToggle(this.selection,this.dataSource);
    }

    applyFilter(filterValue: string) {
        this.materialTableHelper.applyFilter(filterValue,this.dataSource);
    }
}