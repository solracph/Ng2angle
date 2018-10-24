import { Injectable } from '@angular/core';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { Pbp } from '../../../common/model/pbp.model';

@Injectable()
export 
    class RuleService 
{
    constructor () {};
    

    public contractList: Constraint[] =  [
        {id: 1, name: 'H1045', type: "Contract"},
        {id: 2, name: 'H2228', type: "Contract"},
        {id: 3, name: 'H2406', type: "Contract"},
        {id: 4, name: 'R5420', type: "Contract"},
        {id: 5, name: 'R7444', type: "Contract"},
    ];

    public pbpList: Pbp[] = [
        {id: 1, name: '001', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 2, name: '002', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 3, name: '003', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 4, name: '004', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 5, name: '005', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 6, name: '006', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 7, name: '007', type: "PBP", contractId: 1, contractName: 'H1045'},
        {id: 8, name: '008', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 9, name: '009', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 10, name: '010', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 11, name: '011', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 12, name: '012', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 13, name: '013', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 14, name: '014', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 15, name: '015', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 16, name: '016', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 17, name: '017', type: "PBP", contractId: 2, contractName: 'H2228'},
        {id: 18, name: '018', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 19, name: '019', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 20, name: '020', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 21, name: '021', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 22, name: '022', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 23, name: '023', type: "PBP", contractId: 3, contractName: 'H2406'},
        {id: 24, name: '024', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 25, name: '025', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 26, name: '026', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 27, name: '027', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 28, name: '028', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 29, name: '029', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 30, name: '030', type: "PBP", contractId: 4, contractName: 'R5420'},
        {id: 31, name: '031', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 32, name: '032', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 33, name: '033', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 34, name: '034', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 35, name: '035', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 36, name: '036', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 37, name: '037', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 38, name: '038', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 39, name: '039', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 40, name: '040', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 41, name: '041', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 42, name: '042', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 43, name: '043', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 44, name: '044', type: "PBP", contractId: 5, contractName: 'R7444'},
        {id: 45, name: '045', type: "PBP", contractId: 5, contractName: 'R7444'}

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
        {id: 1, name: 'application-1', code:'APP-1', type: "Application"},
        {id: 2, name: 'application-2', code:'APP-2', type: "Application"},
        {id: 3, name: 'application-3', code:'APP-3', type: "Application"}
    ]

    public segmentList: Constraint[] = [
        {id: 1, name: 'ACO', type: "Segment"},
        {id: 2, name: 'DNSP', type: "Segment"},
        {id: 3, name: 'FL-N', type: "Segment"},
        {id: 4, name: 'FL-S', type: "Segment"},
        {id: 5, name: 'FL-S DSNP', type: "Segment"},
        {id: 6, name: 'FL-S WELLMED', type: "Segment"},
        //{id: 7, name: 'GROUP', type: "Segment"},
        {id: 8, name: 'TVH', type: "Segment"},
        {id: 9, name: 'WELLMED', type: "Segment"}
    ]
    
};