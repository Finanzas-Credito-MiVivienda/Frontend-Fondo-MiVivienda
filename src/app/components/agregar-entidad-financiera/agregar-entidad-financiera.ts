import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { EntidadesFinancieras } from '../../services/entidades-financieras';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-agregar-entidad-financiera',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './agregar-entidad-financiera.html',
  styleUrl: './agregar-entidad-financiera.css',
})
export class AgregarEntidadFinanciera {
  logoSeleccionado: string = "icon-bank.png";
  entidadSeleccionada: string = "";
  botonCreditoHabilitado: boolean = false;
  moneda: string = localStorage.getItem("currencyType") || "PEN";
  monthlyIncome: number = 0;
  mostrarAsistente: boolean = false;

  ingresosMinimos: any = {
    bcp: 1500,
    interbank: 1000,
    bbva: 1500,
    scotiabank: 1500,
    banbif: 1000
  };

  entidad = {
    nombreEntidad: "",
    tea: 0.0,
    seguroDesgravamen: 0.0,
    seguroRiesgo: 0.0,
    gastosAdministracion: 0.0,
    costesRegistrales: 0.0,
    costesNotariales: 0.0,
    tasacion: 0.0,
    comisionEstudio: 0.0,
    comisionActivacion: 0.0,
    portes: 0.0,
    comisionPeriodica: 0.0
  };

  logos: any = {
    bcp: "bcp.png",
    interbank: "interbank.png",
    bbva: "bbva.png",
    scotiabank: "scotiabank.png",
    banbif: "banbif.png"
  };

  constructor(
    private service: EntidadesFinancieras,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  cambiarLogo() {
    if (!this.puedeElegirBanco(this.entidadSeleccionada)) {
      this.snackbar.open(
        "No cumple el ingreso mínimo para esta entidad financiera",
        "OK",
        { duration: 2500 }
      );
      this.entidadSeleccionada = "";
      this.logoSeleccionado = "icon-bank.png";
      this.entidad.nombreEntidad = "";
      return;
    }

    this.logoSeleccionado = this.logos[this.entidadSeleccionada] || "icon-bank.png";
    this.entidad.nombreEntidad = this.entidadSeleccionada.toUpperCase();
  }

  guardarEntidad() {
    this.service.registrarEntidadFinanciera(this.entidad).subscribe({
      next: (resp) => {
        console.log("Registrado:", resp);
        localStorage.setItem("entidadFinancieraSeleccionada", JSON.stringify(resp));

        if (resp.id) {
          localStorage.setItem("idEntidadFinanciera", resp.id.toString());
        }

        this.snackbar.open("Entidad registrada correctamente", "OK", { duration: 2000 });

        this.botonCreditoHabilitado = true;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open("Error al registrar entidad", "OK", { duration: 2000 });
      }
    });
  }

  cancelar() {
    localStorage.removeItem("inmuebleSeleccionado");
    localStorage.removeItem("idInmueble");

    this.router.navigate(['/oferta-inmueble']);
  }

  getSimbolo() {
    return this.moneda === "USD" ? "$" : "S/";
  }

  puedeElegirBanco(banco: string): boolean {
    const incomeStr = localStorage.getItem("monthlyIncome");
    const monthlyIncome = incomeStr ? Number(incomeStr) : 0;

    const minimo = this.ingresosMinimos[banco];

    if (minimo == null) {
      console.warn("Banco sin mínimo configurado:", banco);
      return true;
    }

    const puede = monthlyIncome >= minimo;
    //console.log(`Banco: ${banco} | ingreso: ${monthlyIncome} | mínimo: ${minimo} | puede: ${puede}`);
    return puede;
  }

  // Validar solo números y máximo 3 decimales
  validarNumero(event: any) {
    const input = event.target;
    let valor = input.value;

    // Eliminar letras, signos negativos y caracteres inválidos
    valor = valor.replace(/[^0-9.]/g, "");

    // Solo permitir un punto decimal
    const partes = valor.split(".");
    if (partes.length > 2) {
      valor = partes[0] + "." + partes[1];
    }

    // Limitar a 3 decimales sin redondear
    if (partes[1] && partes[1].length > 3) {
      valor = partes[0] + "." + partes[1].substring(0, 3);
    }

    input.value = valor;
  }

  // Formatear a exactamente 3 decimales sin redondear
  formatearTresDecimales(event: any) {
    const input = event.target;
    let valor = input.value;

    if (!valor) return;

    if (!valor.includes(".")) {
      valor = valor + ".000";
    }

    let [enteros, decimales] = valor.split(".");

    if (!decimales) decimales = "000";

    // Cortar sin redondear
    decimales = decimales.substring(0, 3);

    // Completar con ceros si faltan
    while (decimales.length < 3) {
      decimales += "0";
    }

    input.value = `${enteros}.${decimales}`;
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

    localStorage.setItem("ruta_origen", this.router.url);

    this.router.navigate(['/registro-usuario']);
  }
}