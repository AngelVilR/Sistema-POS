import { Injectable } from '@angular/core';
import { EventoModel } from '../models/EventoModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventoService extends BaseAPI<EventoModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointEvento);
      }
      
}