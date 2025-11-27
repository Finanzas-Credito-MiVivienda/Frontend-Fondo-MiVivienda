import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inmueble } from '../models/inmueble';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Inmuebles {
  ruta_servidor: string = "http://localhost:8080/api/v1";
  recurso: string = "inmuebles";

  constructor(private http:HttpClient) { }

  getInmuebles(): Observable<Inmueble[]> {
    return this.http.get<Inmueble[]>(this.ruta_servidor + "/" + this.recurso);
  }
}