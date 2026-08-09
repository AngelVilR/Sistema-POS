import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/UsuarioModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseAPI<UsuarioModel> {

    constructor(private httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointUsuario);
      }
      
      checkEmailExists(email: string): Observable<boolean> {
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.urlAPI}/usuario/check-email/${encodedEmail}`;
    return this.httpClient.get<boolean>(url);
  } 
}