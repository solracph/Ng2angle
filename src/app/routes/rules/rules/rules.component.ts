import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rule } from '../../../common/model/rule.model';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { Pbp } from '../../../common/model/pbp.model';
import { RuleService } from './rule.service';
import { MatTableDataSource, MatStepper, MatPaginator } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { DialogRuleCloneComponent } from './dialog/dialog-rule-clone.component';
import { DialogEditConstraintsComponent } from './dialog/dialog-edit-constraints.component';
import { AlertDialogComponent } from '../../../common/dialog/alert/alert-dialog.component';
import { DialogYesNoComponent } from '../../../common/dialog/yesOrNo/dialog-yes-or-no.component';

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
    @ViewChild('rulePaginator') rulePaginator: MatPaginator; 

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

    public ruleDataIsLoaded: boolean;
    public segmentDataIsLoaded: boolean;
    public contractDataIsLoaded: boolean;
    public pbpDataIsLoaded: boolean;
    public taxIdDataIsLoaded: boolean;
    public measureDataIsLoaded: boolean;
    public applicationDataIsLoaded: boolean;
   

    ngOnInit() {
        this.ruleService.getRules().subscribe((data)=> {
            this.ruleDataIsLoaded = true;
            if(data.success){
                this.ruleDataSource.data = data.value;
                this.ruleDataSource.paginator = this.rulePaginator;
            }
        })

        this.ruleService.getApplications().subscribe((data)=> {
            this.applicationDataIsLoaded = true;
            if(data.success){
                this.applicationDataSource.data = data.value; 
                this.ruleService.applicationList = data.value;
            }
        });

        this.ruleService.getSegments().subscribe((data)=> {
            this.segmentDataIsLoaded = true;
            if(data.success){
                this.segmentDataSource.data = data.value;
                this.ruleService.segmentList = data.value;
            }
        });

        this.ruleService.getPbpList().subscribe((data)=> {
            this.pbpDataIsLoaded = true;
            if(data.success){
                this.pbpDataSource.data = data.value; 
                this.ruleService.pbpList = data.value;
            }
            
        });

        this.ruleService.getContracts().subscribe((data)=> {
            this.contractDataIsLoaded =  true;
            if(data.success){
                this.contractDataSource.data = data.value; 
                this.ruleService.contractList = data.value;
            }
        });

        this.ruleService.getTinList().subscribe((data)=> {
            this.taxIdDataIsLoaded = true;
            if(data.success){
                this.taxIdDataSource.data = data.value; 
                this.ruleService.taxIdList = data.value;
            }
        });

        this.ruleService.getMeasures().subscribe((data)=>{
            this.measureDataIsLoaded = true;
            if(data.success){
                this.measureDataSource.data = data.value; 
                this.ruleService.measureList = data.value;
            }
        });

        this.newRuleFormGroup = this._formBuilder.group({
            descriptionCtrl:  ['',Validators.required]
        });

        this.contractSelection.onChange.subscribe((data) => {
            var newpbpList = [];

            newpbpList = this.filteringPbpDataSource(data.source.selected)

            this.pbpDataSource.data = [...newpbpList];
            this.pbpSelection.clear();

        });
    };

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

        if( selection.length == 0 ){
            newpbpList = [...this.ruleService.pbpList];
        }

        return [...newpbpList];
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
        this.openDialogYesOrNot("Do you want to delete this rule?").subscribe((response: any) =>{
            if(response.result == true){
                this.ruleDataIsLoaded = false;
                var tempRule = _.cloneDeep(rule);
                var pbpToDelete = [];
        
                tempRule.pbp.forEach((pbp: any )=> {
                    pbpToDelete.push({pbpId: pbp.pbpId})
                });
                tempRule.pbp = pbpToDelete;
        
               this.ruleService.deleteRule(tempRule).subscribe(
                   (data)=>{
                        this.ruleDataIsLoaded = true;
                        if(data.success){
                                _.pullAt(dataSource.data,[index]);
                                this.ruleDataSource.data = dataSource.data;
                                this.appState.ruleList = dataSource.data;
                        } else {
                            this.openDialogAlert(data.errors[0].message,'350px');
                        };
                    },
                    (error) =>{
                        this.ruleDataIsLoaded = true;
                    });
            };
        });
    };

    updateRuleDataSource(newRules: any){
        this.ruleDataSource.data = [...this.ruleDataSource.data,newRules];
    }

    saveRule(){
        this.cancelEditRule();
        if(this.newRuleFormGroup.value.descriptionCtrl == ""){
            this.openDialogAlert("Rule Description is required!");
            return;
        }

        this.ruleDataIsLoaded = false;
        this.appState.rulId++;

        var newRule = {
            RuleId: null,
            Code: `R${this.appState.rulId}`,
            Segments: [],
            Contracts: [],
            Pbp: [],
            Tin: [],
            Measures: [],
            Applications: [],
            Description: this.newRuleFormGroup.value.descriptionCtrl,
        }
        
        newRule.Segments = 
            this.segmentSelection.selected.length == 0 
            ? this.segmentDataSource.data
            : this.segmentSelection.selected;

        newRule.Contracts = 
            this.contractSelection.selected.length == 0 
            ? this.contractDataSource.data
            : this.contractSelection.selected;

        var pbpList = 
            this.pbpSelection.selected.length == 0
            ? this.pbpDataSource.data
            : this.pbpSelection.selected;

        var pbpToInsert = [];
        pbpList.forEach((pbp: any )=> {
            pbpToInsert.push({pbpId: pbp.pbpId})
        });
        newRule.Pbp = pbpToInsert;


        newRule.Tin = 
            this.taxIdSelection.selected.length == 0
            ? this.taxIdDataSource.data
            : this.taxIdSelection.selected;

        newRule.Measures = 
            this.measureSelection.selected.length == 0
            ? this.measureDataSource.data
            : this.measureSelection.selected;

        newRule.Applications = 
            this.applicationSelection.selected.length == 0
            ? this.applicationDataSource.data
            : this.applicationSelection.selected;
        
        this.ruleService.createNewRules(newRule).subscribe((data)=>{
            if(data.success)
            {
                this.ruleService.getRules().subscribe((data)=>{
                    this.ruleDataIsLoaded = true;
                    if(data.success){
                        this.ruleDataSource.data = data.value;
                        this.stepperAndSelectionReset();
                    }
                });
            };
        });
    }

    cloneRule(rule: any){
        this.openDialogRuleClone(rule).subscribe((response : any) =>{
            if(response)
            {
                this.ruleDataIsLoaded = false;
                rule.applications = response.applicationSelection.selected;
                rule.description = response.description;
                var pbpToInsert = [];
                rule.pbp.forEach((pbp: any )=> {
                    pbpToInsert.push({pbpId: pbp.pbpId});
                });
                rule.pbp = pbpToInsert;

                this.ruleService.createNewRules(rule).subscribe((data)=>{
                    if(data.success)
                    {
                        this.ruleService.getRules().subscribe((data)=>{
                            this.ruleDataIsLoaded = true;
                            if(data.success)
                            {
                                this.ruleDataSource.data = data.value;
                            };
                        });
                    };
                });
            };
        });
    };

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
        this.openDialogYesOrNot("Do you want to save this changes?",'350px').subscribe((response: any) =>{
            if(response.result == true)
            {
                this.ruleDataIsLoaded = false;
                var pbpToDelete = [];
                rule.pbp.forEach((pbp: any )=> {
                    pbpToDelete.push({pbpId: pbp.pbpId, description: pbp.description})
                });
                rule.pbp = pbpToDelete;
                this.ruleService.updateRule(rule).subscribe((data)=>{
                    this.ruleDataIsLoaded = true;
                    if(data.success){
                        this.toggleEditeRule(rule);
                    };
                });
            }
        });
    };

    togglePanelOpen(rule){
        rule.expanded = !rule.expanded;
    }

    toggleGeneralEditeRule(){
        this.isEditing = !this.isEditing
    }

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

        _.remove(rule.pbp,(pbp) => {
            return pbp;
        });

        rule.contracts.forEach(contract => {
            this.ruleService.pbpList.forEach(pbp => {
                pbp.contracts.forEach(pbpContracts =>{
                    if(pbpContracts.contractId == contract.contractId)
                    rule.pbp.push(pbp);
                })
                
            })
        });
    };

    removeTinConstraint(rule: any,tin: any) {
        _.remove(rule.tin, (constraint: any)=>{
            if(constraint.tinId == tin.tinId )
            return constraint;
        });
    };

    removeMeasureConstraint(rule: any,measure: any) {
        _.remove(rule.measures, (constraint: any)=>{
            if(constraint.measureId == measure.measureId )
            return constraint;
        });
    };

    removeApplicationConstraint(rule: any,application: any) {
        _.remove(rule.applications, (constraint: any)=>{
            if(constraint.applicationId == application.applicationId )
            return constraint;
        });
    };

    openDialogAlert(message, width = '250px'): void {
        this.dialog.open(AlertDialogComponent, {
          width: width,
          data: { message: message}
        });
    };

    openDialogYesOrNot(message, width = '250px') : Observable<any>  {
        return this.dialog.open(DialogYesNoComponent, {
          width: width,
          data: { message: message}
        }).afterClosed();
    };


    openDialogRuleClone(rule: Rule): Observable<any> {
        const dialogRef = this.dialog.open(DialogRuleCloneComponent, {
          width: '550px',
          data: {applicationDataSource: this.applicationDataSource.data,description: rule.description, headerCell: "Application" }
        });
       return dialogRef.afterClosed();
    };

    editRuleSegments(dataSourceType, _constraint,rule){
        this.openDialogEditConstraints(dataSourceType,_constraint,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.segments,(segment) => {
                    return segment;
                });

                data.selection.selected.forEach(selected => {
                    rule.segments.push(selected);
                });
            };
        });
    };

    editRuleContracts(dataSourceType, contracts,rule){
        this.openDialogEditConstraints(dataSourceType,contracts,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.contracts,(contract) => {
                    return contract;
                });

                data.selection.selected.forEach(selected => {
                    rule.contracts.push(selected);
                });

                _.remove(rule.pbp,(pbp) => {
                    return pbp;
                });

                contracts.forEach(contract => {
                    this.ruleService.pbpList.forEach(pbp => {
                        pbp.contracts.forEach(pbpContracts =>{
                            if(pbpContracts.contractId == contract.contractId)
                            rule.pbp.push(pbp);
                        })
                        
                    })
                });
            };
        });
    };

    editRulePBP(dataSourceType, pbp,rule){
        this.openDialogEditConstraints(dataSourceType,pbp,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.pbp,(pbp) => {
                    return pbp;
                });

                data.selection.selected.forEach(selected => {
                    rule.pbp.push(selected);
                });
            };
        });
    };

    editRuleTin(dataSourceType, _constraint,rule){
        this.openDialogEditConstraints(dataSourceType,_constraint,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.tin,(tin) => {
                    return tin;
                });

                data.selection.selected.forEach(selected => {
                    rule.tin.push(selected);
                });
            };
        });
    };

    editRuleMeasures(dataSourceType, _constraint,rule){
        this.openDialogEditConstraints(dataSourceType,_constraint,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.measures,(measure) => {
                    return measure;
                });

                data.selection.selected.forEach(selected => {
                    rule.measures.push(selected);
                });
            };
        });
    };

    editRuleApplications(dataSourceType, _constraint,rule){
        this.openDialogEditConstraints(dataSourceType,_constraint,rule).subscribe((data) => {
            if(data)
            {
                _.remove(rule.applications,(application) => {
                    return application;
                });

                data.selection.selected.forEach(selected => {
                    rule.applications.push(selected);
                });
            };
        });
    };


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
        };

        return  this.dialog.open(DialogEditConstraintsComponent, {
          width: '550px',
          data: {dataSource: dataSource, dataSourceType: dataSourceType, headerCell:dataSourceType , selection: constraint}
        }).afterClosed();;
    };

    ngOnDestroy() {
        this.cancelEditRule();
        this.appState.ruleList = this.ruleDataSource.data;
        this.ruleDataSource.data.forEach( (_rule) => {
            _rule.isEditing = false;
            _rule.expanded = false;
        });
        
    };
};

