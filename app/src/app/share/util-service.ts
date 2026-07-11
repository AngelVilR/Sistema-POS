import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  FormatearFechas(prFecha: any): String {
    prFecha = new Date(prFecha);
    const configFormatoFecha = new Intl.DateTimeFormat(
      'es-CR'
      , {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

    return configFormatoFecha.format(prFecha)
  }

  MetodoPagoToString(prMetodo: any): String {
    let txt = "";
    switch (prMetodo) {
      case "EFECTIVO":
        txt = "Efectivo"
        break;
      case "TARJETA":
        txt = "Tarjeta crédito/débito"
        break;
      default:
        txt = "Método de pago desconocido"
        break;
    }
    return txt;
  }

  PromocionToString(pr2x1: boolean, pr10k: boolean){
    let txt = "No posee descuento"    
    if (pr2x1) {
      txt = "Gelatina 2x1"      
    }
    if (pr10k) {
      txt = "Descuento de 10%"
    }
    return txt
  }
}
