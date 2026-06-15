import { Injectable } from '@angular/core';
import { VentaModel } from '../models/VentaModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends BaseAPI<any> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointVenta);
      }
      
}