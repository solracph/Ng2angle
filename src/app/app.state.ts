import { Injectable } from '@angular/core';

@Injectable()
export 
    class AppState
{
    constructor () {};

    public ruleList: any;

    public rulId: number = 0;

    public userList: any;

    public availableRuleList: any;
}