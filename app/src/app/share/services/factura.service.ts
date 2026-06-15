import { Injectable } from '@angular/core';
import { FacturaModel } from '../models/FacturaModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FacturaService extends BaseAPI<FacturaModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointFactura);
      }
      
}