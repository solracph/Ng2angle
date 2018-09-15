import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { Rule } from './models/rule.model';
import { Constraint } from './models/constraint.model';
import { Application } from './models/application.model';
import { RuleService } from './rule.service';
import { MatPaginator,MatTableDataSource, MatStepper, MatTable } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { AppState } from '../../../app.state';

import * as _ from 'lodash';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

    
    constructor(private _formBuilder: FormBuilder,private ruleService: RuleService, public appState: AppState)
    {
        
    }
     
    @ViewChild('contractPaginator') contractPaginator: MatPaginator;
    @ViewChild('pbpPaginator') pbpPaginator: MatPaginator;
    @ViewChild('taxIdPaginator') taxIdPaginator: MatPaginator;
    @ViewChild('measurePaginator') measurePaginator: MatPaginator;
    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 
    @ViewChild('rulePaginator') rulePaginator: MatPaginator;
    @ViewChild('stepper') stepper: MatStepper;

    public newRuleFormGroup: FormGroup;
    public ruleList: Array<Rule>;
    public pageSizeOptions: Array<number> = [5 ,10, 20];
    public ruleId ;

    public contractDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.contractList);
    public contractSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public pbpDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.pbpList);
    public pbpSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public taxIdDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.taxIdList);
    public taxIdSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public measureDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.measureList);
    public measureSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public applicationDataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>(this.ruleService.applicationList);
    public applicationSelection: SelectionModel<Application> = new SelectionModel<Application>(true, []);

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
   

    ngOnInit() {
        this.ruleList = this.appState.ruleList == undefined ? [] : this.appState.ruleList; 
        this.ruleList.forEach(rule => {
            this.updateRuleDataSource(rule);
        });
        
        this.contractDataSource.paginator = this.contractPaginator;
        this.pbpDataSource.paginator = this.pbpPaginator;
        this.taxIdDataSource.paginator = this.taxIdPaginator;
        this.measureDataSource.paginator = this.measurePaginator;
        this.applicationDataSource.paginator = this.applicationPaginator;
        this.ruleDataSource.paginator = this.rulePaginator;

        this.newRuleFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['']
        });
    }

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

    stepperReset() {
        this.stepper.reset();
    }

    selectionReset() {
        this.contractSelection = new SelectionModel<Constraint>(true, []);
        this.taxIdSelection = new SelectionModel<Constraint>(true, []);
        this.pbpSelection = new SelectionModel<Constraint>(true, []);
        this.measureSelection = new SelectionModel<Constraint>(true, []);
        this.applicationSelection = new SelectionModel<Application>(true, []);
    }

    stepperAndSelectionReset() {
        this.stepperReset();
        this.selectionReset();
    }

    removeRow(index,dataSource) {
        _.pullAt(dataSource.data,[index]);
        this.ruleDataSource.data = dataSource.data;
    }

    updateRuleDataSource(newRules: Rule){
        this.ruleDataSource.data = [...this.ruleDataSource.data,newRules];
    }

    saveRule(){
        this.ruleId = Math.random();
        var newRule = {
            id: this.ruleId,
            code: `R-${this.ruleId}`,
            constraints: [],
            description: this.newRuleFormGroup.value.descriptionCtrl,
        }

        newRule.constraints.push(this.contractSelection.selected);
        newRule.constraints.push(this.taxIdSelection.selected);
        newRule.constraints.push(this.pbpSelection.selected);
        newRule.constraints.push(this.measureSelection.selected);
        newRule.constraints.push(this.applicationSelection.selected);

        this.ruleList.push(newRule);
        this.appState.ruleList = this.ruleList;
        this.updateRuleDataSource(newRule)
        //this.ruleDataSource.data = [...this.ruleDataSource.data,newRule];

        this.stepperAndSelectionReset();

        /* var ruleExist = false;

        this.ruleList.forEach(rule => {
            ruleExist = _.isEqual(rule,newRule);
        });

        if(!ruleExist){
            this.ruleList.push(newRule)
        }*/


    }

}
