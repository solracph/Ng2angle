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
            },
            {
                id: 4,
                name: "Alexa Cruz",
                rules: []
            },
            {
                id: 5,
                name: "Dan Duffield",
                rules: []
            },
            {
                id: 6,
                name: "Alysia Adger",
                rules: []
            },
            {
                id: 7,
                name: "Cathern Crew",
                rules: []
            },
            {
                id: 8,
                name: "Joseph Jeanbaptiste",
                rules: []
            },
            {
                id: 9,
                name: "Mandie Mciver",
                rules: []
            }
            ,
            {
                id: 10, 
                name: "Deetta Donato",
                rules: []
            }
            ,
            {
                id: 11,
                name: "Carmela Capasso",
                rules: []
            }
            ,
            {
                id: 12,
                name: "Laine Lunt",
                rules: []
            }
            ,
            {
                id: 13,
                name: "Latonya Lawerence",
                rules: []
            }
            ,
            {
                id: 14,
                name: "Corrie Corrie",
                rules: []
            }
            ,
            {
                id: 15,
                name: "Peter Pittmon",
                rules: []
            }
            ,
            {
                id: 16,
                name: "Ken Kneeland",
                rules: []
            }
            ,
            {
                id: 17,
                name: "Eleanora Egerton",
                rules: []
            }
            ,
            {
                id: 18,
                name: "Shelley Sheffey",
                rules: []
            }
            ,
            {
                id: 19,
                name: "Catina Cattaneo",
                rules: []
            }
            ,
            {
                id: 20,
                name: "Tasia Tarkington",
                rules: []
            }
            ,
            {
                id: 21,
                name: "Wally Wieczorek",
                rules: []
            }
            ,
            {
                id: 22,
                name: "Jule Joye",
                rules: []
            }
            ,
            {
                id: 23,
                name: "Enoch Espitia",
                rules: []
            }
            ,
            {
                id: 24,
                name: "Kenyetta Kayser",
                rules: []
            }
            ,
            {
                id: 25,
                name: "Doyle Dennis",
                rules: []
            }
        ]
    }
}