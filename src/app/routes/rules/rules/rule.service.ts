import { Injectable } from '@angular/core';
import { Constraint } from './models/constraint.model';
import { Application } from './models/application.model';

@Injectable()
export 
    class RuleService 
{
    constructor () {};

    public contractList: Constraint[] =  [
        {id: 1, name: 'Contracts-1', type: "Contract"},
        {id: 2, name: 'Contracts-2', type: "Contract"},
        {id: 3, name: 'Contracts-3', type: "Contract"}
    ];

    public pbpList: Constraint[] = [
        {id: 1, name: 'PBP-1', type: "PBP"},
        {id: 2, name: 'PBP-2', type: "PBP"},
        {id: 3, name: 'PBP-3', type: "PBP"}
    ]

    public taxIdList: Constraint[] = [
        {id: 1, name: '1524', type: "Tax Id"},
        {id: 2, name: '5484', type: "Tax Id"},
        {id: 3, name: '6547', type: "Tax Id"}
    ]

    public measureList: Constraint[] = [
        {id: 1, name: 'measures-1', type: "Measure"},
        {id: 2, name: 'measures-2', type: "Measure"},
        {id: 3, name: 'measures-3', type: "Measure"}
    ]

    public applicationList: Application[] = [
        {id: 1, name: 'application-1', code:'AP-1', type: "Application"},
        {id: 2, name: 'application-2', code:'AP-2', type: "Application"},
        {id: 3, name: 'application-3', code:'AP-3', type: "Application"}
    ]
    
};