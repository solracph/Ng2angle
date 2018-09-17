import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { Rule } from '../../../common/model/rule.model'
import { User } from '../../../common/model/user.model'
import { AdminService } from './admin.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    
    public ruleList: Array<Rule>;
    public usersNameToAssignedRules;
    public pageSizeOptions: Array<number> = [5 ,10, 20];

    @ViewChild('rulePaginator') rulePaginator: MatPaginator;
    @ViewChild('userPaginator') userPaginator: MatPaginator;
    @ViewChild('assignedRulesPaginator') assignedRulesPaginator: MatPaginator;

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
    public ruleSelection: SelectionModel<Rule> = new SelectionModel<Rule>(true, []);

    public assignedRulesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public assignedRulesSelection: SelectionModel<any> = new SelectionModel<any>(true, []);

    public userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.adminService.getUsers());
    public userSelection: SelectionModel<User> = new SelectionModel<User>(true, []);

    
    constructor(public appState: AppState,private materialTableHelper: MaterialTableHelper,private adminService: AdminService)
    {
        
    }

    ngOnInit() {

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

    /*showAllUserList(e){
        e.target.parentElement.classList.toggle("overflow-visible");
        e.target.parentElement.classList.toggle("overflow-hidden");
        e.target.html = "close"
    }*/

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
    }

    
}
