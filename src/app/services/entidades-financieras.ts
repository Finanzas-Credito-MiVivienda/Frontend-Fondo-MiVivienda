import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidad-financiera';

@Injectable({
  providedIn: 'root',
})
export class EntidadesFinancieras {
  ruta_servidor: string = "http://localhost:8080/api/v1";
  recurso: string = "entidades-financieras";

  constructor(private http: HttpClient) { }

  getEntidadesFinancieras(id: number) {
    return this.http.get<EntidadFinanciera>(this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

  deleteEntidadesFinancieras() {
    return this.http.put<EntidadFinanciera>(this.ruta_servidor + "/" + this.recurso + "/delete/" + (localStorage.getItem("id")), null);
  }

  registrarEntidadFinanciera(entidad: EntidadFinanciera) {
    return this.http.post<EntidadFinanciera>(this.ruta_servidor + "/" + this.recurso, entidad);
  }
}