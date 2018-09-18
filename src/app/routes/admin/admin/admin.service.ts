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
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 2,
                name: "Juan Perez",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 3,
                name: "Alejandro Fernandez",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 4,
                name: "Alexa Cruz",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 5,
                name: "Dan Duffield",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 6,
                name: "Alysia Adger",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 7,
                name: "Cathern Crew",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 8,
                name: "Joseph Jeanbaptiste",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            },
            {
                id: 9,
                name: "Mandie Mciver",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            }
            ,
            {
                id: 10, 
                name: "Deetta Donato",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 11,
                name: "Carmela Capasso",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 12,
                name: "Laine Lunt",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 13,
                name: "Latonya Lawerence",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 14,
                name: "Corrie Corrie",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 15,
                name: "Peter Pittmon",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 16,
                name: "Ken Kneeland",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 17,
                name: "Eleanora Egerton",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 18,
                name: "Shelley Sheffey",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 19,
                name: "Catina Cattaneo",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 20,
                name: "Tasia Tarkington",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 21,
                name: "Wally Wieczorek",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            }
            ,
            {
                id: 22,
                name: "Jule Joye",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 23,
                name: "Enoch Espitia",
                rules: [],
                applicationId: 3,
                applicationCode: 'APP-3'
            }
            ,
            {
                id: 24,
                name: "Kenyetta Kayser",
                rules: [],
                applicationId: 2,
                applicationCode: 'APP-2'
            }
            ,
            {
                id: 25,
                name: "Doyle Dennis",
                rules: [],
                applicationId: 1,
                applicationCode: 'APP-1'
            }
        ]
    }
}