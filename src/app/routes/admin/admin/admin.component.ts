import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { Rule } from '../../../common/model/rule.model';
import { User } from '../../../common/model/user.model';
import { Application } from '../../../common/model/application.model';
import { AdminService } from './admin.service';
import { RuleService } from '../../rules/rules/rule.service';
import {  FormControl } from '@angular/forms';
import { MatDialog} from '@angular/material';

import * as _ from 'lodash';



@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    constructor(
        public appState: AppState,
        private materialTableHelper: MaterialTableHelper,
        private adminService: AdminService,
        public ruleService: RuleService,
        public dialog: MatDialog
    ) {}

    public ruleList: Array<Rule> = [];
    public usersNameToAssignedRules;
    public pageSizeOptions: Array<number> = [5 ,10, 20];
    public applications = new FormControl();
    public applicationList: any; 
    public filterRule: any;

    @ViewChild('rulePaginator') rulePaginator: MatPaginator;
    @ViewChild('userPaginator') userPaginator: MatPaginator;
    @ViewChild('assignedRulesPaginator') assignedRulesPaginator: MatPaginator;

    public availableRuleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
    public availableRuleSelection: SelectionModel<Rule> = new SelectionModel<Rule>(true, []);

    public assignedRulesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public assignedRulesSelection: SelectionModel<any> = new SelectionModel<any>(true, []);

    public userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
    public userSelection: SelectionModel<User> = new SelectionModel<User>(true, []);

    public userDataIsLoaded: boolean;
    public availableRuleDataIsLoaded: boolean;
    public assignedRuleDataIsLoaded: boolean;

    ngOnInit() {
        
        this.adminService.getUsers().subscribe((data) => {
            this.userDataIsLoaded = true;
            if(data.success){
                this.appState.userList = data.value;
                this.userDataSource.data = data.value;
            }
        });

        this.ruleService.getApplications().subscribe((data)=>{
            this.applicationList = data.value;
        });

        if(this.appState.ruleList == undefined || this.appState.ruleList == []){
            this.ruleService.getRules().subscribe((data)=>{
                this.availableRuleDataIsLoaded = true;
                if(data.success){
                    data.value.forEach(rule => {
                        this.updateRuleDataSource(rule);
                    });
                    this.appState.ruleList = data.value;
                }
            });
        } else {
            this.availableRuleDataIsLoaded = true;
            this.appState.ruleList.forEach(rule => {
                this.updateRuleDataSource(rule);
            });
        }
        
        this.availableRuleDataSource.paginator = this.rulePaginator;
        this.userDataSource.paginator = this.userPaginator;
        this.assignedRulesDataSource.paginator = this.assignedRulesPaginator;
    }

    updateRuleDataSource(newRules: Rule){
        this.availableRuleDataSource.data = [...this.availableRuleDataSource.data,newRules];
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

    addRulesToUsers()
    {
        if(this.availableRuleSelection.selected.length > 0)
        {
            this.availableRuleDataIsLoaded = false;
            var usersToUpdate = [];
    
            this.userSelection.selected.forEach(user => {
    
                user.rules = _.union(user.rules,this.availableRuleSelection.selected);
                var tempUser : any = _.cloneDeep(user);
                var userRulesToUpdate = [];
    
                tempUser.rules.forEach(rule => { 
                    userRulesToUpdate.push({ruleId: rule.ruleId})
                });
                tempUser.rules = userRulesToUpdate;
                usersToUpdate.push(tempUser);
            });
    
            this.adminService.updateUserRules(usersToUpdate).subscribe((data) => {
                this.availableRuleDataIsLoaded = true;
                if(data.success)
                {

                }
                this.setUsersAvailableRules(this.userSelection);
                this.setUserCurrentRules(this.userSelection);
                this.availableRuleSelection = new SelectionModel<Rule>(true, []);
                this.maintainAppStateUserList(this.userDataSource.data);
            });
        };
    };

    removeRUles()
    {
        if(this.assignedRulesSelection.selected.length > 0)
        {
            this.assignedRulesSelection.selected.forEach(selection => {
                if(selection != undefined) 
                {
                    this.userSelection.selected.forEach(user => {
                        if(user.rules != undefined) 
                        {
                            _.pullAllBy(user.rules,[selection],"ruleId");
                        }
                    }); 
                }
            }); 

            var usersToUpdate = [];

            this.userSelection.selected.forEach(user => {
                if(user.rules != undefined) 
                {
                    var userToUpdate : any = _.cloneDeep(user);
                    var userRulesToUpdate = [];
                    userToUpdate.rules.forEach(rule => { 
                        userRulesToUpdate.push({ruleId: rule.ruleId})
                    });
                    userToUpdate.rules = userRulesToUpdate;
                    usersToUpdate.push(userToUpdate);
                }
            }); 

            this.availableRuleDataIsLoaded = false;
            this.adminService.updateUserRules(usersToUpdate).subscribe((data) => {
                this.availableRuleDataIsLoaded = true;
                if(data.success)
                {
                    this.setUsersAvailableRules(this.userSelection);
                    this.setUserCurrentRules(this.userSelection);
                    this.assignedRulesSelection = new SelectionModel<Rule>(true, []);
                    this.maintainAppStateUserList(this.userDataSource.data);
                };
            });
        }
    };

    maintainAppStateUserList(users) {
        this.appState.userList.forEach(suser => {
            users.forEach(user => {
                if(user.userId == suser.userId){
                    suser.rules = user.rules;
                }
            });
        });
    }

    setUsersAvailableRules(users)  {
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
                            this.availableRuleDataSource.data = [...this.appState.ruleList];
                            data = _.unionBy(data,_.pullAllBy(this.availableRuleDataSource.data,user.rules,"ruleId"),"ruleId");
                            data = this.filterRuleData(data);
                        }
                    }); 
                    this.availableRuleDataSource.data = this.filterRuleData(data);
                    
                } else {
                    this.availableRuleDataSource.data = [...this.filterRuleData(this.appState.ruleList)];
                }
                
            } else {
                this.availableRuleDataSource.data = [...this.filterRuleData(this.appState.ruleList)];
            }
        }
    }

    filterRuleData(rules){
        if(this.filterRule != 0 && this.filterRule != undefined)
        {
            var newRules = [];
            rules.forEach(rule => {
                rule.applications.forEach(application => {
                    if(application.applicationId == this.filterRule || application.applicationId == undefined){
                        newRules.push(rule);
                        return;
                    }
                });
            });
    
            return newRules;
        }else{
            return rules;
        }
    }

    setUserCurrentRules(users) {
        var data = [];
        users.selected.forEach(user => {
            if(user.rules != undefined) 
            {
                data = _.unionBy(data,user.rules,"ruleId");
            }
        }); 
        this.assignedRulesDataSource.data = data;
    }

    getUsersNameToAssignedRules(userRules,ruleId,user) {
        if(_.find(userRules,['ruleId',ruleId]) != undefined)
            return user.userName
    }
    

    filterUserByApplication(event): void { 

        if(event.isUserInput == true){
            if(event.source.value == 0){
                this.userDataSource.data = [...this.appState.userList];
                return;
            }
            this.userSelection = new SelectionModel<User>(true, []);
            this.setUsersAvailableRules(this.userSelection);
            this.assignedRulesDataSource = new MatTableDataSource<User>();

            var users = [...this.appState.userList];
            var _users = [];
                
                users.forEach(user => {
                    user.applications.forEach(application => {
                        if(application.applicationId == event.source.value ){
                            _users.push(user);
                        }
                    });
                   
                });

            this.userDataSource.data = _users;
        }
    }

    filterRuleByApplication(event): void {
        if(event.isUserInput == true){
            this.filterRule = event.source.value;
            this.setUsersAvailableRules(this.userSelection);
        }
    }
}

