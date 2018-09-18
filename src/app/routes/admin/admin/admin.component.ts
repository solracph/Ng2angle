import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { Rule } from '../../../common/model/rule.model';
import { User } from '../../../common/model/user.model';
import { Application } from '../../../common/model/application.model';
import { AdminService } from './admin.service';
import { RuleService } from '../../rules/rules/rule.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

export interface Food {
    value: string;
    viewValue: string;
  }
  

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    foods: Food[] = [
        {value: 'steak-0', viewValue: 'Steak'},
        {value: 'pizza-1', viewValue: 'Pizza'},
        {value: 'tacos-2', viewValue: 'Tacos'}
    ];
    selectedValue;
    
    public ruleList: Array<Rule>;
    public usersNameToAssignedRules;
    public pageSizeOptions: Array<number> = [5 ,10, 20];
    public applications = new FormControl();
    public applicationList: Array<Application>; 
    

    @ViewChild('rulePaginator') rulePaginator: MatPaginator;
    @ViewChild('userPaginator') userPaginator: MatPaginator;
    @ViewChild('assignedRulesPaginator') assignedRulesPaginator: MatPaginator;

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
    public ruleSelection: SelectionModel<Rule> = new SelectionModel<Rule>(true, []);

    public assignedRulesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public assignedRulesSelection: SelectionModel<any> = new SelectionModel<any>(true, []);

    public userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.adminService.getUsers());
    public userSelection: SelectionModel<User> = new SelectionModel<User>(true, []);

    
    
    constructor(
        public appState: AppState,
        private materialTableHelper: MaterialTableHelper,
        private adminService: AdminService,
        public ruleService: RuleService,
        public dialog: MatDialog
    ){ }

    ngOnInit() {
        this.appState.userList = this.adminService.getUsers();
        this.applicationList = this.ruleService.applicationList;
        this.ruleList = this.appState.ruleList == undefined ? [] : this.appState.ruleList; 

        this.ruleList.forEach(rule => {
            this.updateRuleDataSource(rule);
        });

        this.ruleDataSource.paginator = this.rulePaginator;
        this.userDataSource.paginator = this.userPaginator;
        this.assignedRulesDataSource.paginator = this.assignedRulesPaginator;
    }

    updateRuleDataSource(newRules: Rule){
        this.ruleDataSource.data = [...this.ruleDataSource.data,newRules];
    }

    isAllSelected(selection,dataSource) {
        return this.materialTableHelper.isAllSelected(selection,dataSource)
    }

    userMasterToggle(selection,dataSource) {
        this.materialTableHelper.masterToggle(selection,dataSource);
        this.setUsersAvailableRules(selection);
        this.setUserCurrentRules(selection)
    }

    userSelectionToggle(selection,row){
        selection.toggle(row);
        this.setUsersAvailableRules(selection);
        this.setUserCurrentRules(selection);
    }

    masterToggle(selection,dataSource) {
        this.materialTableHelper.masterToggle(selection,dataSource);
    }

    applyFilter(filterValue: string, dataSource) {
        this.materialTableHelper.applyFilter(filterValue,dataSource);
    }

    

    addRulesToUsers(){
        this.userSelection.selected.forEach(user => {
            this.ruleSelection.selected.forEach(rule => {
                user.rules = _.union(user.rules,[rule]);
            });
        });

        this.setUsersAvailableRules(this.userSelection);
        this.setUserCurrentRules(this.userSelection);

        this.ruleSelection = new SelectionModel<Rule>(true, []);

        this.maintainAppStateUserList(this.userDataSource.data);
    }

    removeRUles(selection)
    {
        selection.selected.forEach(selection => {
            if(selection != undefined) 
            {
                _.pullAll(this.assignedRulesDataSource.data,[selection]);
                this.assignedRulesDataSource.data = this.assignedRulesDataSource.data;

                this.userSelection.selected.forEach(user => {
                    if(user.rules != undefined) 
                    {
                        _.pullAll(user.rules,[selection]);
                        user.rules = user.rules;
                    }
                }); 
            }
        }); 
        this.setUsersAvailableRules(this.userSelection);
        this.assignedRulesSelection = new SelectionModel<Rule>(true, []);

        this.maintainAppStateUserList(this.userDataSource.data);
        
    }

    maintainAppStateUserList(users: Array<User>)
    {

        this.appState.userList.forEach(suser => {
            users.forEach(user => {
                if(user.id == suser.id){
                    suser.rules = user.rules;
                }
            });
        });

    }

    setUsersAvailableRules(users)
    {
        if(this.appState.ruleList != undefined)
        {
            var haveAllRulesAvailable  = _.find(users.selected, function(o) { return o.rules.length == 0 });
    
            if(haveAllRulesAvailable == undefined)
            {
                
                if(users.selected.length > 0){
                    var data = [];
                    users.selected.forEach(user => {
                        if(user.rules != undefined) 
                        {
                            this.ruleDataSource.data = [...this.appState.ruleList];
                            data = _.union(data,_.pullAll(this.ruleDataSource.data,user.rules));
                        }
                    }); 
                    this.ruleDataSource.data = data;
                    
                } else {
                    this.ruleDataSource.data = [...this.appState.ruleList];
                }
                
            } else {
                this.ruleDataSource.data = [...this.appState.ruleList];
            }
        }
    }

    setUserCurrentRules(users) {
        var data = [];
        users.selected.forEach(user => {
            if(user.rules != undefined) 
            {
                data = _.union(data,user.rules);
            }
        }); 
        this.assignedRulesDataSource.data = data;
    }

    setUsersNameToAssignedRules(userRules,rulId,user){
        if(_.find(userRules,['id',rulId]) != undefined )
        {
            return user.name
        }
    }

    

    applicationFilter(event): void{ 
        if(event.isUserInput == true){

            console.log(event.source.value);

            if(event.source.value == 0){
                this.userDataSource.data = [...this.appState.userList];
                return;
            }
            this.userSelection = new SelectionModel<User>(true, []);
            this.setUsersAvailableRules(this.userSelection);
            this.assignedRulesDataSource = new MatTableDataSource<User>();


            var users = [...this.appState.userList]
            var _users = [];
                
                users.forEach(user => {
                    if(user.applicationId == event.source.value ){
                        _users.push(user);
                    }
                });

            this.userDataSource.data = _users;
        }
        
        
    }

   /* openDialogApplicationFilter(): Observable<any> {
        const dialogRef = this.dialog.open(DialogApplicationFilter, {
            width: '550px',
            data: {applicationDataSource: this.ruleService.applicationList }
        });
    
       return dialogRef.afterClosed();
    }*/
}
/*
@Component({
    selector: 'dialog-application-filter',
    templateUrl: 'dialog-application-filter.html',
    styleUrls: ['dialog-application-filter.scss']
  })
  export class DialogApplicationFilter {

    @ViewChild('applicationPaginator') applicationPaginator: MatPaginator; 

    public applicationSelection: SelectionModel<Application> = new SelectionModel<Application>(true, []);
    public applicationDataSource: MatTableDataSource<Application> = new MatTableDataSource<Application>([]);
    public clonedRuleFormGroup: FormGroup;

    
    constructor(
        public dialogRef: MatDialogRef<DialogApplicationFilter>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private materialTableHelper: MaterialTableHelper,
    ) {}
    

    ngOnInit(){
        this.applicationDataSource = new MatTableDataSource<Application>(this.data.applicationDataSource);
        this.applicationDataSource.paginator = this.applicationPaginator;
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }

    onApply(){
        if(this.applicationSelection.selected.length > 0){
            this.dialogRef.close({applicationSelection: this.applicationSelection});
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
}*/
