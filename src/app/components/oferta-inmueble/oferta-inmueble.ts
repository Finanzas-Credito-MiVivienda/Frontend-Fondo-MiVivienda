import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Inmueble } from '../../models/inmueble';
import { Inmuebles } from '../../services/inmuebles';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-oferta-inmueble',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './oferta-inmueble.html',
  styleUrl: './oferta-inmueble.css',
})
export class OfertaInmueble {
  inmuebles: Inmueble[] = [];
  filtroTexto: string = "";
  filtroTipo: string = "";
  filtroEstado: string = "";
  filtroPrecio: string = "";
  filtroArea: string = "";

  inmueblesOriginal: Inmueble[] = [];

  ingresoUsuario: number = 0;

  constructor(private inmuebleService: Inmuebles, private router: Router) { }

  ngOnInit(): void {
    const ingreso = localStorage.getItem("monthlyIncome");
    this.ingresoUsuario = ingreso ? Number(ingreso) : 0;

    this.inmuebleService.getInmuebles().subscribe(data => {
      this.inmuebles = data;
      this.inmueblesOriginal = [...data];
    });
  }

  /*puedeFinanciar(item: Inmueble): boolean {
    // Regla simple: ingreso mínimo = 10% del precio de venta
    const ingresoMinimo = item.precioVenta * 0.1;
    return this.ingresoUsuario >= ingresoMinimo;
  }*/

  financiar(item: Inmueble) {
    localStorage.setItem("inmuebleSeleccionado", JSON.stringify(item));
    this.router.navigate(['/registrar-entidad-financiera']);
  }

  aplicarFiltros() {
    let datos = [...this.inmueblesOriginal];

    // FILTRO TEXTO
    if (this.filtroTexto.trim() !== "") {
      const t = this.filtroTexto.toLowerCase();
      datos = datos.filter(item =>
        item.departamento.toLowerCase().includes(t) ||
        item.distrito.toLowerCase().includes(t) ||
        item.direccion.toLowerCase().includes(t)
      );
    }

    // FILTRO TIPO
    if (this.filtroTipo !== "") {
      datos = datos.filter(item => item.tipoVivienda === this.filtroTipo);
    }

    // FILTRO ESTADO
    if (this.filtroEstado !== "") {
      datos = datos.filter(item => item.estadoVivienda === this.filtroEstado);
    }

    // FILTRO PRECIO
    if (this.filtroPrecio !== "") {
      const p = Number(this.filtroPrecio);
      if (p <= 500000) {
        datos = datos.filter(item => item.precioVenta <= p);
      } else {
        datos = datos.filter(item => item.precioVenta > 500000);
      }
    }

    // FILTRO ÁREA
    if (this.filtroArea !== "") {
      const a = Number(this.filtroArea);
      datos = datos.filter(item => item.areaM2 >= a);
    }

    this.inmuebles = datos;
  }

  logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("rol");
    localStorage.removeItem("jwtToken");
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  irPerfil() {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // Guardar ruta actual
    localStorage.setItem("ruta_origen", this.router.url);

    this.router.navigate(['/registro-usuario']);
  }
}