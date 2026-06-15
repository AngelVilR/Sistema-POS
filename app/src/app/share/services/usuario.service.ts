import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/UsuarioModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseAPI<UsuarioModel> {

    constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointUsuario);
      }
      
}