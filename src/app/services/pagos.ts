import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagoCronograma } from '../models/pago-cronograma';
import { PagoTotal } from '../models/pago-total';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Pagos {
  //ruta_servidor: string = "http://localhost:8080/api/v1";
  ruta_servidor: string = environment.apiUrl
  recurso: string = "pagos";

  constructor(private http: HttpClient) { }

  getPlanPagosCronograma(id: number) {
    return this.http.get<PagoCronograma[]>(this.ruta_servidor + "/" + this.recurso + "/generar-cronograma/" + id.toString());
  }

  getPlanPagosTotales(id: number) {
    return this.http.get<PagoTotal>(this.ruta_servidor + "/" + this.recurso + "/cronograma/" + id.toString() + "/totales");
  }
}