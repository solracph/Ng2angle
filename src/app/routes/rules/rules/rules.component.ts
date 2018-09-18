import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from '../../../common/model/rule.model';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { RuleService } from './rule.service';
import { MatPaginator,MatTableDataSource, MatStepper } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

    
    constructor (
        private _formBuilder: FormBuilder,
        private ruleService: RuleService, 
        public appState: AppState, 
        private materialTableHelper: MaterialTableHelper,
        public dialog: MatDialog
    )
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
            descriptionCtrl:  ['',Validators.required]
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
        this.appState.rulId++;

        if(this.newRuleFormGroup.value.descriptionCtrl == ""){
            this.openDialogDescriptionRequired();
            return;
        }

        var newRule = {
            id: this.appState.rulId,
            code: `R${this.appState.rulId}`,
            constraints: [],
            description: this.newRuleFormGroup.value.descriptionCtrl,
        }

        if(this.contractSelection.selected.length > 0) {
            if(this.contractSelection.selected.length == this.contractDataSource.data.length){
                newRule.constraints.push([{
                    type: "Contract",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.contractSelection.selected);
            }
        }

        if(this.taxIdSelection.selected.length > 0)
        {
            if(this.taxIdSelection.selected.length == this.taxIdDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Tax Id",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.taxIdSelection.selected);
            }
        }

        if(this.pbpSelection.selected.length > 0){
            if(this.pbpSelection.selected.length == this.pbpDataSource.data.length) {
                newRule.constraints.push([{
                    type: "PBP",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.pbpSelection.selected);
            }
        }
        
        if(this.measureSelection.selected.length > 0){
            if(this.measureSelection.selected.length == this.measureDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Measure",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.measureSelection.selected);
            }
        }

        if(this.applicationSelection.selected.length > 0){
            if(this.applicationSelection.selected.length == this.applicationDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Application",
                    code: "AP-1",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.applicationSelection.selected);
            }
        }

        this.ruleList.push(newRule);
        this.appState.ruleList = this.ruleList;

        this.updateRuleDataSource(newRule)
        this.stepperAndSelectionReset();
    }

    cloneRule(i: number,rule: any){

        this.openDialogApplicationRequired(rule).subscribe((response : any) =>{
            if(response){
                this.appState.rulId++;

                var newConstraints = [];
                rule.constraints.forEach(constraint => {
                    if(_.find(constraint,["type","Application"]) == undefined){
                        newConstraints.push(constraint)
                    }
                });

                if(response.applicationSelection.selected.length == this.ruleService.applicationList.length){
                    newConstraints.push([{
                        type: "Application",
                        code: "AP-1",
                        name: "All"
                    }]);
                }else{
                    newConstraints.push(response.applicationSelection.selected);
                }
                

                var _rule = {
                    id: this.appState.rulId,
                    code: `R${this.appState.rulId}`,
                    constraints: newConstraints,
                    description: response.description
                }
        
                this.updateRuleDataSource(_rule);
                this.ruleList.push(_rule);
                this.appState.ruleList = this.ruleList;
            }
        });
        
    }


    openDialogDescriptionRequired(): void {
        const dialogRef = this.dialog.open(DialogDescriptionRequired, {
          width: '250px'
        });
    }

    openDialogApplicationRequired(rule: Rule): Observable<any> {
        const dialogRef = this.dialog.open(DialogApplicationRequired, {
          width: '550px',
          data: {applicationDataSource: this.applicationDataSource.data,description: rule.description }
        });
    
       return dialogRef.afterClosed();
    }
}

@Component({
    selector: 'dialog-description-required',
    templateUrl: 'dialog-description-required.html',
  })
  export class DialogDescriptionRequired {
  
    constructor(public dialogRef: MatDialogRef<DialogDescriptionRequired> ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'dialog-application-required',
    templateUrl: 'dialog-application-required.html',
    styleUrls: ['dialog-application-required.scss']
  })
  export class DialogApplicationRequired {

    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 

    public applicationSelection: SelectionModel<Application> = new SelectionModel<Application>(true, []);
    public applicationDataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);
    public clonedRuleFormGroup: FormGroup;

    
    constructor(
        public dialogRef: MatDialogRef<DialogApplicationRequired>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper,
        private _formBuilder: FormBuilder,
    ) {}
    

    ngOnInit(){

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