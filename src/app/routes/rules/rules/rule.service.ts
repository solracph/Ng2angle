import { Injectable } from '@angular/core';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';

@Injectable()
export 
    class RuleService 
{
    constructor () {};

    public contractList: Constraint[] =  [
        {id: 1, name: 'Contracts-1', type: "Contract"},
        {id: 2, name: 'Contracts-2', type: "Contract"},
        {id: 3, name: 'Contracts-3', type: "Contract"},
        {id: 3, name: 'Contracts-4', type: "Contract"},
    ];

    public pbpList: Constraint[] = [
        {id: 1, name: 'H2001', type: "PBP"},
        {id: 2, name: 'H2003', type: "PBP"},
        {id: 3, name: 'H2002', type: "PBP"}
    ]

    public taxIdList: Constraint[] = [
        {id: 1, name: '152454', type: "Tax Id"},
        {id: 2, name: '548444', type: "Tax Id"},
        {id: 3, name: '456845', type: "Tax Id"},
        {id: 4, name: '456344', type: "Tax Id"},
        {id: 5, name: '654745', type: "Tax Id"},
        {id: 6, name: '654647', type: "Tax Id"},
        {id: 7, name: '656134', type: "Tax Id"},
        {id: 8, name: '987538', type: "Tax Id"},
        {id: 9, name: '553845', type: "Tax Id"},
        {id: 10, name: '77897', type: "Tax Id"},
        {id: 11, name: '77897', type: "Tax Id"}
    ]

    public measureList: Constraint[] = [
        {id: 1, name: 'MA', type: "Measure"},
        {id: 2, name: 'MRP', type: "Measure"},
        {id: 3, name: 'ART', type: "Measure"},
        {id: 4, name: 'OMW', type: "Measure"}
    ]

    public applicationList: Application[] = [
        {id: 1, name: 'Application-1', code:'AP-1', type: "Application"},
        {id: 2, name: 'Application-2', code:'AP-2', type: "Application"},
        {id: 3, name: 'Application-3', code:'AP-3', type: "Application"}
    ]
    
};