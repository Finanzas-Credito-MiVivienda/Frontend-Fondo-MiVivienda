import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreditoRequest } from '../models/creditoRequest';
import { CreditoResponse } from '../models/creditoResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Creditos {
  //ruta_servidor: string = "http://localhost:8080/api/v1";
  ruta_servidor: string = environment.apiUrl
  recurso: string = "creditos";

  constructor(private http: HttpClient) { }

  deleteCredito() {
    return this.http.put<CreditoRequest>(this.ruta_servidor + "/" + this.recurso + "/" + (localStorage.getItem("id")), null);
  }

  calcularCredito(credito: CreditoRequest) {
    return this.http.post<CreditoResponse>(this.ruta_servidor + "/" + this.recurso + "/calcular-credito", credito);
  }

  registrarCredito(credito: CreditoRequest) {
    return this.http.post<CreditoResponse>(this.ruta_servidor + "/" + this.recurso + "/registrar-credito", credito);
  }
}