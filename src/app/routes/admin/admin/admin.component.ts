import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../../app.state';
import { MaterialTableHelper } from '../../../common/service/material-table-helper.service';
import { MatPaginator,MatTableDataSource } from '@angular/material';
import { SelectionModel} from '@angular/cdk/collections';
import { Rule } from '../../../common/model/rule.model'
import * as _ from 'lodash';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    
    public ruleList: Array<Rule>;

    @ViewChild('rulePaginator') rulePaginator: MatPaginator;

    public ruleDataSource: MatTableDataSource<Rule> = new MatTableDataSource<Rule>([]);
    public ruleSelection: SelectionModel<Rule> = new SelectionModel<Rule>(true, []);
    
    constructor(public appState: AppState,private materialTableHelper: MaterialTableHelper)
    {
        
    }
    

    ngOnInit() {
        this.ruleList = this.appState.ruleList == undefined ? [] : this.appState.ruleList; 
        this.ruleList.forEach(rule => {
            this.updateRuleDataSource(rule);
        });

        console.log(this.appState.ruleList);
    }

    updateRuleDataSource(newRules: Rule){
        this.ruleDataSource.data = [...this.ruleDataSource.data,newRules];
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
