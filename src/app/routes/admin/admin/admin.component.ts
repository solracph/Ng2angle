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

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
    public ruleSelection: SelectionModel<Rule> = new SelectionModel<Rule>(true, []);

    public assignedRulesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public assignedRulesSelection: SelectionModel<any> = new SelectionModel<any>(true, []);

    public userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
    public userSelection: SelectionModel<User> = new SelectionModel<User>(true, []);

    ngOnInit() {
        
        this.adminService.getUsers().subscribe((data) => {
            console.log('getUsers',data)
            this.appState.userList = data.value;
            this.userDataSource.data = data.value;
        });

        this.ruleService.getApplications().subscribe((data)=>{
            console.log('getApplications',data)
            this.applicationList = data.value;
        });

        if(this.appState.ruleList == undefined || this.appState.ruleList == []){
            this.ruleService.getRules().subscribe((data)=>{
                console.log('getRules',data)
                if(data.success){
                    data.value.forEach(rule => {
                        this.updateRuleDataSource(rule);
                    });
                    this.appState.ruleList = data.value;
                }
            });
        } else {
            this.appState.ruleList.forEach(rule => {
                this.updateRuleDataSource(rule);
            });
        }
        
       

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
        var usersToUpdate = [];
        this.userSelection.selected.forEach(user => {
           
            this.ruleSelection.selected.forEach(rule => {
                user.rules = _.union(user.rules,[rule]);

                var userToUpdate : any = _.cloneDeep(user);
                var userRulesToUpdate = [];
                userToUpdate.rules.forEach(rule => { 
                    userRulesToUpdate.push({ruleId: rule.ruleId})
                });
                userToUpdate.rules = userRulesToUpdate;
                usersToUpdate.push(userToUpdate);
            });
        });

        this.adminService.updateUserRules(usersToUpdate).subscribe((data) => {
            console.log(data)
        })
        this.setUsersAvailableRules(this.userSelection);
        this.setUserCurrentRules(this.userSelection);
        this.ruleSelection = new SelectionModel<Rule>(true, []);
        this.maintainAppStateUserList(this.userDataSource.data);
    }

    removeRUles(selection)
    {
        var usersToUpdate = [];
        selection.selected.forEach(selection => {
            if(selection != undefined) 
            {
                _.pullAllBy(this.assignedRulesDataSource.data,[selection],"ruleId");
                this.assignedRulesDataSource.data = this.assignedRulesDataSource.data;
                debugger
                this.userSelection.selected.forEach(user => {
                    if(user.rules != undefined) 
                    {
                        _.pullAllBy(user.rules,[selection],"ruleId");
                        var userToUpdate : any = _.cloneDeep(user);

                        var userRulesToUpdate = [];
                        userToUpdate.rules.forEach(rule => { 
                            userRulesToUpdate.push({ruleId: rule.ruleId})
                        });
                        userToUpdate.rules = userRulesToUpdate;
                        usersToUpdate.push(userToUpdate);
                    }
                }); 
            }
        }); 
        this.adminService.updateUserRules(usersToUpdate).subscribe((data) => {
            console.log(data)
        })
        this.setUsersAvailableRules(this.userSelection);
        this.assignedRulesSelection = new SelectionModel<Rule>(true, []);
        this.maintainAppStateUserList(this.userDataSource.data);
    }

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
                            this.ruleDataSource.data = [...this.appState.ruleList];
                            data = _.unionBy(data,_.pullAllBy(this.ruleDataSource.data,user.rules,"ruleId"),"ruleId");
                            data = this.filterRuleData(data);
                        }
                    }); 
                    this.ruleDataSource.data = this.filterRuleData(data);
                    
                } else {
                    this.ruleDataSource.data = [...this.filterRuleData(this.appState.ruleList)];
                }
                
            } else {
                this.ruleDataSource.data = [...this.filterRuleData(this.appState.ruleList)];
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
        debugger
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

