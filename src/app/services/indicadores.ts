import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Indicador } from '../models/indicador';

@Injectable({
  providedIn: 'root',
})
export class Indicadores {
  ruta_servidor: string = "http://localhost:8080/api/v1";
  recurso: string = "indicadores";

  constructor(private http: HttpClient) { }

  getIndicadores(id: number) {
    return this.http.get<Indicador>(this.ruta_servidor + "/" + this.recurso + "/generar-indicadores/" + id.toString());
  }
}