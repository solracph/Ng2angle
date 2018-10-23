import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from '../../../common/model/rule.model';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { Pbp } from '../../../common/model/pbp.model';
import { RuleService } from './rule.service';
import { MatPaginator,MatTableDataSource, MatStepper } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { DialogRuleCloneComponent } from './dialog/dialog-rule-clone.component';
import { DialogEditConstraintsComponent } from './dialog/dialog-edit-constraints.component';
import { AlertDialogComponent } from '../../../common/dialog/alert/alert-dialog.component';


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
    ) {}

    /*@ViewChild('segmentPaginator') segmentPaginator: MatPaginator; 
    @ViewChild('contractPaginator') contractPaginator: MatPaginator;
    @ViewChild('pbpPaginator') pbpPaginator: MatPaginator;
    @ViewChild('taxIdPaginator') taxIdPaginator: MatPaginator;
    @ViewChild('measurePaginator') measurePaginator: MatPaginator;
    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 
    @ViewChild('rulePaginator') rulePaginator: MatPaginator;*/
    @ViewChild('stepper') stepper: MatStepper;

    public newRuleFormGroup: FormGroup;
    public ruleList: Array<Rule>;
    public pageSizeOptions: Array<number> = [5 ,10, 20];
    public isEditing: boolean = false;
    public noEditedRule: any;//Array<Rule>;

    public segmentDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.segmentList);
    public segmentSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public contractDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>(this.ruleService.contractList);
    public contractSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public pbpDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Pbp>(this.ruleService.pbpList);
    public pbpSelection: SelectionModel<Constraint> = new SelectionModel<Pbp>(true, []);

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
        
        /*this.segmentDataSource.paginator = this.segmentPaginator;
        this.contractDataSource.paginator = this.contractPaginator;
        this.pbpDataSource.paginator = this.pbpPaginator;
        this.taxIdDataSource.paginator = this.taxIdPaginator;
        this.measureDataSource.paginator = this.measurePaginator;
        this.applicationDataSource.paginator = this.applicationPaginator;
        this.ruleDataSource.paginator = this.rulePaginator;*/

        this.newRuleFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['',Validators.required]
        });

        this.contractSelection.onChange.subscribe((data) => {
            var newpbpList = [];

            newpbpList = this.filteringPbpDataSource(data.source.selected)

            this.pbpDataSource.data = [...newpbpList];
            this.pbpSelection.clear();

        })
    }

    filteringPbpDataSource(selection){
        
        var newpbpList = [];

        selection.forEach(contract => {
            this.ruleService.pbpList.forEach(pbp => {
                if(pbp.contractId == contract.id){
                    newpbpList.push(pbp)
                }
            });
        });

        if(selection.length == 0){
            newpbpList = [...this.ruleService.pbpList];
        }

        return [...newpbpList];
    }

   

   /* isAllSelected(selection,dataSource) {
        return this.materialTableHelper.isAllSelected(selection,dataSource)
    }

    masterToggle(selection,dataSource) {
        this.materialTableHelper.masterToggle(selection,dataSource);
    }*/

    onContractSelect(e){
    }

    applyFilter(filterValue: string, dataSource) {
        this.materialTableHelper.applyFilter(filterValue,dataSource);
    }

    stepperReset() {
        this.stepper.reset();
    }

    selectionReset() {
        this.segmentSelection.clear();
        this.contractSelection.clear();
        this.taxIdSelection.clear();
        this.pbpSelection.clear();
        this.measureSelection.clear();
        this.applicationSelection.clear();
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
        this.cancelEditRule();

        if(this.newRuleFormGroup.value.descriptionCtrl == ""){
            this.openDialogRequired("Rule Description is required!");
            return;
        }

        var newRule = {
            id: this.appState.rulId,
            code: `R${this.appState.rulId}`,
            constraints: [],
            isEditing: false,
            description: this.newRuleFormGroup.value.descriptionCtrl,
        }

        if(this.segmentSelection.selected.length > 0) {
            if(this.segmentSelection.selected.length == this.segmentDataSource.data.length){
                newRule.constraints.push([{
                    type: "Segment",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.segmentSelection.selected);
            }
        }else{
            newRule.constraints.push([{
                type: "Segment",
                name: "All"
            }]);
            /*this.openDialogRequired("Rule Segment is required!");
            return;*/
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
        }else{

            newRule.constraints.push([{
                type: "Contract",
                name: "All"
            }])
            /*this.openDialogRequired("Rule Contract is required!");
            return;*/
        }

        if(this.pbpSelection.selected.length > 0){
            if(this.pbpSelection.selected.length == this.ruleService.pbpList.length) {
                newRule.constraints.push([{
                    type: "PBP",
                    name: "All"
                }])
            } else {
                newRule.constraints.push(this.pbpSelection.selected);
            }
        }else{
            newRule.constraints.push([{
                type: "PBP",
                name: "All"
            }])
            //this.openDialogRequired("Rule PBP Id is required!");
            //return;
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
        }else{
            newRule.constraints.push([{
                type: "Tax Id",
                name: "All"
            }])
            /*this.openDialogRequired("Rule Tax Id is required!");
            return;*/
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
        }else{
            newRule.constraints.push([{
                type: "Measure",
                name: "All"
            }])
            /*this.openDialogRequired("Rule Measure Id is required!");
            return;*/
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
        }else{
            newRule.constraints.push([{
                type: "Application",
                code: "AP-1",
                name: "All"
            }])
            /*this.openDialogRequired("Rule Application Id is required!");
            return;*/
        }

        this.ruleList.push(newRule);
        this.appState.ruleList = this.ruleList;

        this.updateRuleDataSource(newRule)
        this.stepperAndSelectionReset();
    }

    cloneRule(rule: any){

        this.openDialogRuleClone(rule).subscribe((response : any) =>{
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
                    description: response.description,
                    isEditing: false
                }
        
                this.updateRuleDataSource(_.cloneDeep(_rule));
                this.ruleList.push(_rule);
                this.appState.ruleList = this.ruleList;
            }
        });
        
    }

    editRule(rule: Rule){
        this.ruleDataSource.data.forEach( (_rule) => {
            if(_rule.id != rule.id)
            {
                _rule.isEditing = false;
                _rule.expanded = false;
            }
        });
        this.noEditedRule = _.cloneDeep(this.ruleDataSource.data);
        this.toggleEditeRule(rule);
    }

    cancelEditRule(){
        if(this.noEditedRule != undefined && this.isEditing == true)
        this.ruleDataSource.data = _.cloneDeep(this.noEditedRule);
        this.isEditing = false;
    }
    
    toggleEditeRule(rule){
        rule.isEditing = !rule.isEditing
        this.toggleGeneralEditeRule();
    }

    togglePanelOpen(rule){
        rule.expanded = !rule.expanded;
    }

    toggleGeneralEditeRule(){
        this.isEditing = !this.isEditing
    }

    removeConstraint(_rule: any,_constraint: Constraint) {
        _rule.constraints.forEach((constraints: any) => {
           _.remove(constraints, (constraint: Constraint)=>{
                if(constraint.type == _constraint.type && constraint.id == _constraint.id )
                return constraint;
           })
        });

        _.remove(_rule.constraints,(constraint: any)=>{
            if(constraint.length == 0)
            return constraint;
        })
    }

    openDialogRequired(message): void {
        this.dialog.open(AlertDialogComponent, {
          width: '250px',
          data: { message: message}
        });
    }

    openDialogRuleClone(rule: Rule): Observable<any> {
        const dialogRef = this.dialog.open(DialogRuleCloneComponent, {
          width: '550px',
          data: {applicationDataSource: this.applicationDataSource.data,description: rule.description, headerCell: "Application" }
        });
    
       return dialogRef.afterClosed();
    }

    editConstraints(dataSourceType, constraint,rule){
        this.openDialogEditConstraints(dataSourceType,constraint,rule).subscribe((data) => {
            if(data)
            {
                rule.constraints.forEach((constraints: any) => {
                    if(constraints[0].type == data.selection.selected[0].type)
                    {
                       _.remove(constraints,(constraint) => {
                            return constraint;
                       })
                       data.selection.selected.forEach(selected => {
                            constraints.push(selected);
                       });
                    }
                 });
            }
        });
    }

    openDialogEditConstraints(dataSourceType, constraint, rule): Observable<any> 
    {
       var contractList = [];
        rule.constraints.forEach(constraint => {
            constraint.forEach(d => {
                if(d.type == 'Contract' )
                contractList.push(d)
            });
        })

        console.log(contractList);
        
        var dataSource;
        switch(dataSourceType) {
            case 'Segment':
                dataSource = this.segmentDataSource.data;
                break;
            case 'Contract':
                dataSource = this.contractDataSource.data;
                break;
            case 'Tax Id':
                dataSource = this.taxIdDataSource.data;
                break;
            case 'PBP':
                dataSource = this.filteringPbpDataSource(contractList)//this.pbpDataSource.data;
                break;
            case 'Measure':
                dataSource = this.measureDataSource.data;
                break;
            case 'Application':
                dataSource = this.applicationDataSource.data;
                break;
        }

        return  this.dialog.open(DialogEditConstraintsComponent, {
          width: '550px',
          data: {dataSource: dataSource, dataSourceType: dataSourceType, headerCell:dataSourceType , selection: constraint}
        }).afterClosed();;
    }

    ngOnDestroy() {
        this.cancelEditRule();
        this.appState.ruleList = this.ruleDataSource.data;
        this.ruleDataSource.data.forEach( (_rule) => {
            _rule.isEditing = false;
            _rule.expanded = false;
        });
        
    }
}

