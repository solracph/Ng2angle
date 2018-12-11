import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable()
export class AppConfiguration
{
    public clinicalApiUrl: string = `${environment.baseApiUrl}clinical`;
}