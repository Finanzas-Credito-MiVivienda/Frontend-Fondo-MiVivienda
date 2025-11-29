import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Inmueble } from '../../models/inmueble';
import { Inmuebles } from '../../services/inmuebles';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  mostrarPopup: boolean = false;
  inmuebleEditando!: Inmueble;
  nuevoPrecio: number = 0;
  nuevoPrecioTexto: string = "";

  mostrarAsistente: boolean = false;
  esAdmin: boolean = false;


  constructor(private inmuebleService: Inmuebles, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    const rol = localStorage.getItem("rol");
    this.esAdmin = rol === "ADMIN";
    
    const ingreso = localStorage.getItem("monthlyIncome");
    this.ingresoUsuario = ingreso ? Number(ingreso) : 0;

    this.inmuebleService.getInmuebles().subscribe(data => {
      this.inmuebles = data;
      this.inmueblesOriginal = [...data];
    });
  }

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

  abrirPopup(item: Inmueble) {
    this.inmuebleEditando = { ...item };

    this.nuevoPrecioTexto = item.precioVenta.toString();

    this.mostrarPopup = true;
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  validarPrecio() {
    let valor = this.nuevoPrecioTexto;

    // Permitir solo dígitos y punto
    valor = valor.replace(/[^0-9.]/g, "");

    // No permitir punto al inicio
    if (valor.startsWith(".")) {
      valor = "";
    }

    // Solo un punto decimal
    const partes = valor.split(".");
    if (partes.length > 2) {
      valor = partes[0] + "." + partes[1];
    }

    // Limitar a 2 decimales sin redondear
    if (partes[1] && partes[1].length > 2) {
      partes[1] = partes[1].substring(0, 2);
      valor = partes[0] + "." + partes[1];
    }

    this.nuevoPrecioTexto = valor;
  }

  formatearAlSalir() {
    if (!this.nuevoPrecioTexto) return;

    let valor = this.nuevoPrecioTexto;

    // Si no tiene punto, agregar .00
    if (!valor.includes(".")) {
      valor = valor + ".00";
    }

    let [enteros, decimales] = valor.split(".");

    // Si no hay decimales, completar .00
    if (!decimales) {
      decimales = "00";
    }

    // Limitar decimales a máximo 2 sin redondear
    decimales = decimales.substring(0, 2);

    // Completar con ceros si falta
    while (decimales.length < 2) {
      decimales += "0";
    }

    this.nuevoPrecioTexto = `${enteros}.${decimales}`;
  }

  guardarPrecio() {
    if (!this.nuevoPrecioTexto || Number(this.nuevoPrecioTexto) <= 0) {
      console.log("El precio debe ser mayor a 0");
      return;
    }

    const actualizado: Inmueble = {
      ...this.inmuebleEditando,
      precioVenta: Number(this.nuevoPrecioTexto)
    };

    this.inmuebleService.editInmueble(actualizado).subscribe({
      next: () => {
        // Actualizar inmediatamente en pantalla
        this.inmuebles = this.inmuebles.map(item =>
          item.id === actualizado.id ? actualizado : item
        );

        this.snackbar.open("Precio actualizado correctamente", "OK", { duration: 2500 });

        this.cerrarPopup();
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar el precio.");
      }
    });
  }

  toggleAsistente() {
    this.mostrarAsistente = !this.mostrarAsistente;
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