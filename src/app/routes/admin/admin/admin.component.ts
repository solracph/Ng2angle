import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.state';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    
    constructor(public appState: AppState)
    {
        
    }

    ngOnInit() {
        console.log(this.appState.ruleList);
    }

}
