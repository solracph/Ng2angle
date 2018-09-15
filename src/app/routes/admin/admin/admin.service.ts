import { Injectable } from '@angular/core';
import { User } from '../../../common/model/user.model';

@Injectable()
export 
    class AdminService 
{
    constructor () {};

    getUsers() : Array<User>{
        return [
            {
                id: 1,
                name: "Ana Paula",
                rules: []
            },
            {
                id: 2,
                name: "Juan Perez",
                rules: []
            },
            {
                id: 3,
                name: "Alejandro Fernandez",
                rules: []
            }
        ]
    }
}