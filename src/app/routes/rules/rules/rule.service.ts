import { Injectable } from '@angular/core';
import { Constraint } from '../../../common/model/constraint.model';
import { Application } from '../../../common/model/application.model';
import { Pbp } from '../../../common/model/pbp.model';
import { BaseClinicalService } from '../../../common/service/base-clinical.service';
import { AppConfiguration } from '../../../app.configuration';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export 
    class RuleService 
    extends BaseClinicalService 
{
    constructor (
        public http: HttpClient ,
        public appConfiguration: AppConfiguration  
    ) {
        super();
    };

    public contractList: Constraint[];

    public pbpList: Pbp[];

    public taxIdList: Constraint[];
    
    public measureList: Constraint[];

    public applicationList: Application[];

    public segmentList: Constraint[];
    
    getApplications()
    {
        return this.get('get-applications');
    }

    getSegments()
    {
        return this.get('get-segments');
    }

    getPbpList()
    {
        return this.get('get-pbp-list');
    }

    getContracts()
    {
        return this.get('get-contracts');
    }

    getTinList()
    {
        return this.get('get-tin-list');
    }

    getMeasures()
    {
        return this.get('get-measures');
    }

    getRules()
    {
        return this.get('get-rules');
    }

    createNewRules(rule)
    {
        return this.post('create-new-rule',rule);
    }

    deleteRule(rule)
    {
        return this.post('delete-rule',rule);
    }
    
    updateRule(rule)
    {
        return this.post('update-rule',rule);
    }
};