import { Injectable } from '@angular/core';
import { User } from '../../../common/model/user.model';
import { BaseClinicalService } from '../../../common/service/base-clinical.service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../../../app.configuration';

@Injectable()
export 
    class AdminService 
    extends BaseClinicalService 
{
    constructor (
        public http: HttpClient ,
        public appConfiguration: AppConfiguration  
    ) {
        super();
    };

    public users: User[];

    getUsers() {
        return this.get('get-users');
    }

    updateUserRules(users){
        return this.post('update-user-rules',users);
    }
}