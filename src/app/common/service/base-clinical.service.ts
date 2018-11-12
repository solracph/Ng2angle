
import { HttpHeaders, HttpClient,  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConfiguration } from '../../app.configuration';
import { Result } from '../model/result.model';

export class BaseClinicalService 
{
    httpOptions =  {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
        params: null
    };

    constructor
    (
        public http?: HttpClient ,
        public appConfiguration?: AppConfiguration  
    ) { };

    post( controller: string, parameters: any)  : Observable<any> 
    {
        return this.http.post<Result>(
            `${this.appConfiguration.clinicalApiUrl}/${controller}`,       
                parameters,
            this.httpOptions
        );
    };

    get(controller: string,parameters?: any)  : Observable<any> 
    {
        if(parameters != null || parameters !+ undefined)
        this.httpOptions.params = new HttpParams().set('parameters', JSON.stringify(parameters));
        
        return this.http.get<Result>(`${this.appConfiguration.clinicalApiUrl}/${controller}`,this.httpOptions);
    };
}