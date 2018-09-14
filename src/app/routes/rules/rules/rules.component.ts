import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { Rule } from './models/rule.model';
import { Constraint } from './models/constraint.model';
import { Application } from './models/application.model';
import { RuleService } from './rule.service';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';

import * as _ from 'lodash';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }
  

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

    
    constructor(private _formBuilder: FormBuilder,private ruleService: RuleService)
    {
        
    }
     
    @ViewChild('contractPaginator') contractPaginator: MatPaginator;
    @ViewChild('pbpPaginator') pbpPaginator: MatPaginator;
    @ViewChild('taxIdPaginator') taxIdPaginator: MatPaginator;
    @ViewChild('measurePaginator') measurePaginator: MatPaginator;
    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator;

    public isLinear = false;
    public newRuleFormGroup: FormGroup;
    public ruleList: Array<Rule> = []; 
    public pageSizeOptions: Array<number> = [1 ,5, 10];

    public contractDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.contractList);
    public contractSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public pbpDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.pbpList);
    public pbpSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public taxIdDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.taxIdList);
    public taxIdSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public measureDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.measureList);
    public measureSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public applicationDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.applicationList);
    public applicationSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    ngOnInit() {

        this.contractDataSource.paginator = this.contractPaginator;
        this.pbpDataSource.paginator = this.pbpPaginator;
        this.taxIdDataSource.paginator = this.taxIdPaginator;
        this.measureDataSource.paginator = this.measurePaginator;
        this.applicationDataSource.paginator = this.applicationPaginator;

        this.newRuleFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['']
        });
    }

    isAllSelected(selection) {
        const numSelected = selection.selected.length;
        const numRows = this.taxIdDataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(selection,dataSource) {
        this.isAllSelected(selection) ?
            selection.clear() :
            dataSource.data.forEach(row => selection.select(row));
    }

    applyFilter(filterValue: string, dataSource) {
        dataSource.filter = filterValue.trim().toLowerCase();
    }

     saveRule(){
        /*if(!this.newRuleFormGroup.invalid){
            console.log(_.find(this.applicationList,['id',this.newRuleFormGroup.value.applicationCtrl]));

            var newRule = {
                id: 1,
                code: _.find(this.applicationList,['id',this.newRuleFormGroup.value.applicationCtrl]).code,
                constraints: [
                    {
                        type: _.find(this.contractList,['id',this.newRuleFormGroup.value.contractCtrl]).type,
                        id:  this.newRuleFormGroup.value.contractCtrl,
                        name: _.find(this.contractList,['id',this.newRuleFormGroup.value.contractCtrl]).name
                    },
                    {
                        type: _.find(this.pbpList,['id',this.newRuleFormGroup.value.pbpCtrl]).type,
                        id:  this.newRuleFormGroup.value.pbpCtrl,
                        name: _.find(this.pbpList,['id',this.newRuleFormGroup.value.pbpCtrl]).name
                    },
                    {
                        type: _.find(this.taxIdList,['id',this.newRuleFormGroup.value.taxIdCtrl]).type,
                        id:  this.newRuleFormGroup.value.taxIdCtrl,
                        name: _.find(this.taxIdList,['id',this.newRuleFormGroup.value.taxIdCtrl]).name
                    /,
                    {
                        type: _.find(this.measureList,['id',this.newRuleFormGroup.value.measureCtrl]).type,
                        id:  this.newRuleFormGroup.value.contractCtrl,
                        name: _.find(this.measureList,['id',this.newRuleFormGroup.value.measureCtrl]).name
                    },
                    {
                        type: _.find(this.applicationList,['id',this.newRuleFormGroup.value.applicationCtrl]).type,
                        id:  this.newRuleFormGroup.value.contractCtrl,
                        name: _.find(this.applicationList,['id',this.newRuleFormGroup.value.applicationCtrl]).name
                    }
                ],
                description: this.newRuleFormGroup.value.descriptionCtrl,
            }
            
            var ruleExist = false;

            this.ruleList.forEach(rule => {
                ruleExist = _.isEqual(rule,newRule);
            });

            if(!ruleExist){
                this.ruleList.push(newRule)
            }
            
        }*/

     }

}
