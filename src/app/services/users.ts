import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { tap } from 'rxjs';
import { User } from '../models/user';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Users {
  //ruta_servidor: string = "http://localhost:8080/api/v1";
  ruta_servidor: string = environment.apiUrl
  recurso: string = "users";

  constructor(private http: HttpClient) { }

  getUsers(id: number) {
    return this.http.get<User>(this.ruta_servidor + "/" + this.recurso + "/" + id.toString());
  }

  deleteUser() {
    return this.http.put<User>(this.ruta_servidor + "/" + this.recurso + "/delete/" + (localStorage.getItem("user_id")), null);
  }

  registrarClient(cliente: Client) {
    return this.http.post<User>(this.ruta_servidor + "/" + this.recurso + "/registrar", cliente);
  }

  modificarClient(client: Client) {
    return this.http.put<Client>(this.ruta_servidor + "/" + this.recurso + "/update/" + client.id.toString(), client);
  }

  login(user: User) {
    this.logout();
    return this.http.post<Token>(this.ruta_servidor + "/" + this.recurso + "/login", user).pipe(
      tap((resultado: Token) => {
        localStorage.setItem("jwtToken", resultado.jwtToken);
        localStorage.setItem("user_id", resultado.user_id.toString());
        localStorage.setItem("rol", resultado.rol);
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  hayUsuarioLogueado() {
    if (this.getUserIdActual() == null || this.getUserIdActual() == "") {
      return false;
    }
    return true;
  }

  getTokenActual() {
    return localStorage.getItem("jwtToken");
  }

  getUserIdActual() {
    return localStorage.getItem("user_id");
  }

  getRolActual() {
    return localStorage.getItem("rol");
  }
}