import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from '../../../common/model/rule.model';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { Pbp } from '../../../common/model/pbp.model';
import { RuleService } from './rule.service';
import { MatTableDataSource, MatStepper } from '@angular/material';
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
   
    @ViewChild('stepper') stepper: MatStepper;

    public newRuleFormGroup: FormGroup;
    public ruleList: Array<any>;
    public pageSizeOptions: Array<number> = [5 ,10, 20];
    public isEditing: boolean = false;
    public noEditedRule: any;

    public segmentDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>();
    public segmentSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public contractDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>();
    public contractSelection: SelectionModel<Constraint>= new SelectionModel<Constraint>(true, []);

    public pbpDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Pbp>();
    public pbpSelection: SelectionModel<Constraint> = new SelectionModel<Pbp>(true, []);

    public taxIdDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>();
    public taxIdSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public measureDataSource: MatTableDataSource<Constraint> = new MatTableDataSource<Constraint>();
    public measureSelection: SelectionModel<Constraint> = new SelectionModel<Constraint>(true, []);

    public applicationDataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>();
    public applicationSelection: SelectionModel<Application> = new SelectionModel<Application>(true, []);

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
   

    ngOnInit() {

        this.ruleService.getRules().subscribe((data)=>{
            data.value[0].isEditing = false;
            this.ruleDataSource.data = data.value;
        })

        this.ruleService.getApplications().subscribe((data)=>{
            this.applicationDataSource.data = data.value; //console.log(data);
            this.ruleService.applicationList = data.value;
        });

        this.ruleService.getSegments().subscribe((data)=>{
            this.segmentDataSource.data = data.value;
            this.ruleService.segmentList = data.value;
        });

        this.ruleService.getPboList().subscribe((data)=>{
            this.pbpDataSource.data = data.value; 
            this.ruleService.pbpList = data.value;
        });

        this.ruleService.getContracts().subscribe((data)=>{
            this.contractDataSource.data = data.value; 
            this.ruleService.contractList = data.value;
        });

        this.ruleService.getTinList().subscribe((data)=>{
            this.taxIdDataSource.data = data.value; console.log(data);
            this.ruleService.taxIdList = data.value;
        });

        this.ruleService.getMeasures().subscribe((data)=>{
            this.measureDataSource.data = data.value; console.log(data);
            this.ruleService.measureList = data.value;
        });

        this.ruleList = this.appState.ruleList == undefined ? [] : this.appState.ruleList; 
        this.ruleList.forEach(rule => {
            this.updateRuleDataSource(rule);
        });
        
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
                pbp.contracts.forEach(con => {
                    if(con.contractId == contract.contractId){
                        newpbpList.push(pbp)
                    }
                });
            });
        });

        if(selection.length == 0 || selection[0].name == 'All'){
            newpbpList = [...this.ruleService.pbpList];
        }

        return [...newpbpList];
    }

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
        this.pbpDataSource.filteredData = [];
    }

    stepperAndSelectionReset() {
        this.stepperReset();
        this.selectionReset();
    }

    removeRow(index,dataSource,rule) {
        debugger
        var pbpToDelete = [];
        rule.pbp.forEach((pbp: any )=> {
            pbpToDelete.push({pbpId: pbp.pbpId})
        });
        rule.pbp = pbpToDelete;

       this.ruleService.deleteRule(rule).subscribe((data)=>{
           if(data.success){
                _.pullAt(dataSource.data,[index]);
                this.ruleDataSource.data = dataSource.data;
                this.appState.ruleList = dataSource.data;
           }
       })
    }

    updateRuleDataSource(newRules: any){
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
            RuleId: null,
            Code: `R${this.appState.rulId}`,
            Segments: [],
            Contracts: [],
            Pbp: [],
            Tin: [],
            Measures: [],
            Applications: [],
            //isEditing: false,
            Description: this.newRuleFormGroup.value.descriptionCtrl,
        }

        //if(this.segmentSelection.selected.length > 0) {
            /*if(this.segmentSelection.selected.length == this.segmentDataSource.data.length){
                newRule.constraints.push([{
                    type: "Segment",
                    name: "All"
                }])
            } else {*/
                newRule.Segments = this.segmentSelection.selected;
           /* }*/
        /*}else{
            newRule.constraints.push([{
                type: "Segment",
                name: "All"
            }]);
        }*/

        /*if(this.contractSelection.selected.length > 0) {
            if(this.contractSelection.selected.length == this.contractDataSource.data.length){
                newRule.constraints.push([{
                    type: "Contract",
                    name: "All"
                }])
            } else {*/
                newRule.Contracts = this.contractSelection.selected;
       /*     }
        }else{

            newRule.constraints.push([{
                type: "Contract",
                name: "All"
            }])
        }*/

        /*if(this.pbpSelection.selected.length > 0){
            if(this.pbpSelection.selected.length == this.ruleService.pbpList.length) {
                newRule.constraints.push([{
                    type: "PBP",
                    name: "All"
                }])
            } else {*/
                var pbpToInsert = [];
                this.pbpSelection.selected.forEach((pbp: any )=> {
                    pbpToInsert.push({pbpId: pbp.pbpId})
                });
                newRule.Pbp = pbpToInsert;
        /*    }
        }else{
            newRule.constraints.push([{
                type: "PBP",
                name: "All"
            }])
        }*/

        /*if(this.taxIdSelection.selected.length > 0)
        {
            if(this.taxIdSelection.selected.length == this.taxIdDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Tax Id",
                    name: "All"
                }])
            } else {*/
                newRule.Tin = this.taxIdSelection.selected;
         /*   }
        }else{
            newRule.constraints.push([{
                type: "Tax Id",
                name: "All"
            }])
        }*/
        
       /* if(this.measureSelection.selected.length > 0){
            if(this.measureSelection.selected.length == this.measureDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Measure",
                    name: "All"
                }])
            } else {*/
                newRule.Measures = this.measureSelection.selected;
        /*    }
        }else{
            newRule.constraints.push([{
                type: "Measure",
                name: "All"
            }])
        }*/

        /*if(this.applicationSelection.selected.length > 0){
            if(this.applicationSelection.selected.length == this.applicationDataSource.data.length) {
                newRule.constraints.push([{
                    type: "Application",
                    code: "AP-1",
                    name: "All"
                }])
            } else {*/
                newRule.Applications= this.applicationSelection.selected;
        /*    }
        }else{
            newRule.constraints.push([{
                type: "Application",
                code: "AP-1",
                name: "All"
            }])
        }*/

        
        this.ruleService.createNewRules(newRule).subscribe((data)=>{
            this.ruleList.push(newRule);
            this.appState.ruleList = this.ruleList;
            this.updateRuleDataSource(newRule)
            this.stepperAndSelectionReset();
        });
        
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

    saveUpdateRule(rule){
        var pbpToDelete = [];
        rule.pbp.forEach((pbp: any )=> {
            pbpToDelete.push({pbpId: pbp.pbpId, description: pbp.description})
        });
        rule.pbp = pbpToDelete;
        this.ruleService.updateRule(rule).subscribe((data)=>{
            this.toggleEditeRule(rule);
        })
    }

    togglePanelOpen(rule){
        rule.expanded = !rule.expanded;
    }

    toggleGeneralEditeRule(){
        this.isEditing = !this.isEditing
    }

    /*removeConstraint(_rule: any,_constraint: Constraint) {
        debugger
        _rule.constraints.forEach((constraints: any) => {
           _.remove(constraints, (constraint: Constraint)=>{
                if(constraint.type == _constraint.type && constraint.id == _constraint.id )
                return constraint;
           })
        });

        _rule.constraints.forEach((constraints: any) => {
            _.remove(constraints, (constraint: any)=>{
                if(constraint.type == 'PBP' && constraint.contractName == _constraint.description ){
                    return constraint;
                }
            })
         });

         _rule.constraints.forEach((constraints: any) => {
            if(constraints.length == 0){
                constraints.push({
                    type: 'PBP',
                    name: "All"
                });
            }
         })
    }*/

    removeSegmentsConstraint(rule: any,segment: any) {
        _.remove(rule.segments, (constraint: any)=>{
            if(constraint.segmentId == segment.segmentId )
                return constraint;
        });
    }

    removePbpConstraint(rule: any,pbp: any) {
        _.remove(rule.pbp, (constraint: any)=>{
            if(constraint.pbpId == pbp.pbpId )
            return constraint;
        });
    }

    removeContractsConstraint(rule: any,contract: any) {
        _.remove(rule.contracts, (constraint: any)=>{
            if(constraint.contractId == contract.contractId )
            return constraint;
        });
    }

    removeTinConstraint(rule: any,tin: any) {
        _.remove(rule.tin, (constraint: any)=>{
            if(constraint.tinId == tin.tinId )
            return constraint;
        });
    }

    removeMeasureConstraint(rule: any,measure: any) {
        _.remove(rule.measures, (constraint: any)=>{
            if(constraint.measureId == measure.measureId )
            return constraint;
        });
    }

    removeApplicationConstraint(rule: any,application: any) {
        _.remove(rule.applications, (constraint: any)=>{
            if(constraint.applicationId == application.applicationId )
            return constraint;
        });
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

    editConstraints(dataSourceType, _constraint,rule){
        this.openDialogEditConstraints(dataSourceType,_constraint,rule).subscribe((data) => {
            if(data)
            {
                rule.constraints.forEach((constraints: any) => {
                    if(constraints[0].type == data.selection.selected[0].type)
                    {
                       _.remove(constraints,(constraint) => {
                            return constraint;
                       });
                       
                       data.selection.selected.forEach(selected => {
                            constraints.push(selected);
                       });
                    }
                 });

                if(_constraint[0].type == 'Contract'){
                    var newPbpList = [];

                    data.selection.selected.forEach((selection: any) => {
                       
                       rule.constraints.forEach((constraints: any) => {

                           if(constraints[0].type == 'PBP' && constraints[0].name != 'All'){
                                constraints.forEach(constraint => {
                                    if(constraint.contractName == selection.name ){
                                        newPbpList.push(constraint);
                                    }
                                });

                                _.remove(constraints,(constraint) => {
                                    return constraint;
                                });

                                newPbpList.forEach(pbp => {
                                    constraints.push(pbp);
                                });

                                if(newPbpList.length == 0) {
                                    constraints.push({
                                        type: 'PBP',
                                        name: "All"
                                    })
                                }
                           }
                       });
                    });
                };
            };
        });
    }

    openDialogEditConstraints(dataSourceType, constraint, rule): Observable<any> 
    {
        var dataSource;
        switch(dataSourceType) {
            case 'Segment':
                dataSource = this.segmentDataSource.data;
                break;
            case 'Contract':
                dataSource = this.contractDataSource.data;
                break;
            case 'TaxId':
                dataSource = this.taxIdDataSource.data;
                break;
            case 'PBP':
                dataSource = this.filteringPbpDataSource(rule.contracts)
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

