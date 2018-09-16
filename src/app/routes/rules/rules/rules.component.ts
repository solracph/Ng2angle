import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Rule } from '../../../common/model/rule.model';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { RuleService } from './rule.service';
import { MatPaginator,MatTableDataSource, MatStepper } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service'

import * as _ from 'lodash';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

    
    constructor(private _formBuilder: FormBuilder,private ruleService: RuleService, public appState: AppState, private materialTableHelper: MaterialTableHelper)
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
        return this.materialTableHelper.isAllSelected(selection,dataSource)
    }

    masterToggle(selection,dataSource) {
        this.materialTableHelper.masterToggle(selection,dataSource);
    }

    applyFilter(filterValue: string, dataSource) {
        this.materialTableHelper.applyFilter(filterValue,dataSource);
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
        this.appState.ruleList = dataSource.data;
    }

    updateRuleDataSource(newRules: Rule){
        this.ruleDataSource.data = [...this.ruleDataSource.data,newRules];
    }

    saveRule(){
        var ruleId = Math.random();
        var newRule = {
            id: ruleId,
            code: `R-${ruleId}`,
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

        this.stepperAndSelectionReset();
    }

    cloneRule(i: number,rule: Rule){
        
        var ruleId = Math.random();

        var _rule = {
            id: ruleId,
            code: `R-${ruleId}`,
            constraints: rule.constraints,
            description: rule.description
        }

        this.updateRuleDataSource(_rule);
        this.ruleList.push(_rule);
        this.appState.ruleList = this.ruleList;
    }

}
