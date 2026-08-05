import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private urlAPI = environment.apiURL;
  private endpoint = environment.endPointReporte;

  constructor(private http: HttpClient) { }

  getVentasPorTipoTransaccion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAPI}/${this.endpoint}/ventas-por-tipo-transaccion`);
  }

  getProductosPorVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAPI}/${this.endpoint}/productos-por-ventas`);
  }

  getVentasPorUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAPI}/${this.endpoint}/ventas-por-usuario`);
  }
}
