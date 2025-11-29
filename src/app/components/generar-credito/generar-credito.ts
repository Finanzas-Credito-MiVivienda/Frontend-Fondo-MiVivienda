import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Creditos } from '../../services/creditos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditoResponse } from '../../models/creditoResponse';
import { CreditoRequest } from '../../models/creditoRequest';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntidadesFinancieras } from '../../services/entidades-financieras';

@Component({
  selector: 'app-generar-credito',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './generar-credito.html',
  styleUrl: './generar-credito.css',
})
export class GenerarCredito {
  tipoTasaInteres: string = "";
  frecuenciaPago: string = "";
  tipoPeriodoGracia: string = "";
  tasaInteres: number = 0;
  periodoGracia: number = 0;
  numeroAnios: number = 0;
  cok: number = 0;
  pCuotaInicial: number = 0;

  entidadFinancieraSeleccionada: any;
  fechaHoy: string = "";
  resultados: CreditoResponse | null = null;
  creditoGuardado: boolean = false;

  inmuebleSeleccionado: any;
  estadoConstruido: boolean = false;

  mostrarAsistente: boolean = false;


  constructor(private router: Router, private creditoService: Creditos, private entidadesService: EntidadesFinancieras, private snackbar: MatSnackBar) { }

  ngOnInit() {

    const inmuebleStr = localStorage.getItem("inmuebleSeleccionado");

    if (inmuebleStr) {
      this.inmuebleSeleccionado = JSON.parse(inmuebleStr);

      this.estadoConstruido = this.inmuebleSeleccionado.estadoVivienda === "CONSTRUIDO";

      console.log("Estado del inmueble:", this.inmuebleSeleccionado.estadoVivienda);
      console.log("¿Bloquear periodo de gracia?:", this.estadoConstruido);

      if (this.estadoConstruido) {
        this.tipoPeriodoGracia = "NINGUNO";
        this.periodoGracia = 0;
      }
    }

    const idEntidad = Number(localStorage.getItem("idEntidadFinanciera"));

    if (!idEntidad) {
      console.error("No hay idEntidadFinanciera en localStorage");
      return;
    }

    this.entidadesService.getEntidadesFinancieras(idEntidad).subscribe({
      next: (entidad) => {
        this.entidadFinancieraSeleccionada = entidad;
        this.tasaInteres = entidad.tea;

        console.log("ENTIDAD CARGADA DESDE BACKEND:", entidad);
      },
      error: (err) => {
        console.error("Error cargando entidad financiera:", err);
      }
    });

    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const day = hoy.getDate().toString().padStart(2, '0');
    this.fechaHoy = `${year}-${month}-${day}`;
  }

  cancelar() {
    localStorage.removeItem("entidadFinancieraSeleccionada");
    localStorage.removeItem("idEntidadFinanciera");

    this.router.navigate(['/registrar-entidad-financiera']);
  }

  calcularCredito() {
    console.log("📤 Cuota Inicial:", this.pCuotaInicial);

    if (this.pCuotaInicial === null || isNaN(this.pCuotaInicial)) {
      this.snackbar.open("Ingrese un valor válido para la cuota inicial", "OK", { duration: 2000 });
      return;
    }

    const credito: CreditoRequest = {
      tipoTasaInteres: this.tipoTasaInteres!,
      tasaInteres: this.tasaInteres!,
      frecuenciaPago: this.frecuenciaPago!,
      fechaInicio: this.fechaHoy,
      tipoPeriodoGracia: this.tipoPeriodoGracia!,
      periodoGracia: this.periodoGracia!,
      numeroAnios: this.numeroAnios!,
      cok: this.cok!,
      pcuotaInicial: Number(this.pCuotaInicial),
      idUsuario: Number(localStorage.getItem("user_id")),
      idEntidadFinanciera: Number(localStorage.getItem("idEntidadFinanciera")),
      idInmueble: this.getIdInmueble()
    };

    console.log("📤 ENVIANDO AL BACKEND PARA CALCULAR:", credito);
    console.log("📤 JSON REAL ENVIADO:", JSON.stringify(credito));

    this.creditoService.calcularCredito(credito).subscribe({
      next: (resp) => {
        this.resultados = resp;
        this.snackbar.open("Cálculo realizado correctamente", "OK", { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open("Error al calcular crédito", "OK", { duration: 2000 });
      }
    });
  }

  guardarCredito() {
    if (!this.resultados) {
      this.snackbar.open("Primero debe calcular el crédito", "OK", { duration: 2000 });
      return;
    }

    const credito: CreditoRequest = {
      tipoTasaInteres: this.tipoTasaInteres!,
      tasaInteres: this.tasaInteres!,
      frecuenciaPago: this.frecuenciaPago!,
      fechaInicio: this.fechaHoy,
      tipoPeriodoGracia: this.tipoPeriodoGracia!,
      periodoGracia: this.periodoGracia!,
      numeroAnios: this.numeroAnios!,
      cok: this.cok!,
      pcuotaInicial: Number(this.pCuotaInicial),
      idUsuario: Number(localStorage.getItem("user_id")),
      idEntidadFinanciera: Number(localStorage.getItem("idEntidadFinanciera")),
      idInmueble: this.getIdInmueble()
    };

    this.creditoService.registrarCredito(credito).subscribe({
      next: (resp) => {
        this.resultados = resp;
        this.creditoGuardado = true;

        localStorage.setItem("creditoRegistrado", JSON.stringify(this.resultados));

        this.snackbar.open("Crédito registrado correctamente", "OK", { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open("Error al registrar crédito", "OK", { duration: 2000 });
      }
    });
  }

  intentadoVerCronograma() {
    if (!this.creditoGuardado) {
      this.snackbar.open(
        "Primero debe guardar el crédito antes de ver el cronograma",
        "OK",
        { duration: 2500 }
      );
    }
  }

  private getIdInmueble(): number {
    const inmuebleJson = localStorage.getItem("inmuebleSeleccionado");
    return inmuebleJson ? JSON.parse(inmuebleJson).id : 0;
  }

  getSimbolo() {
    const moneda = localStorage.getItem("currencyType");
    return moneda === "USD" ? "$" : "S/";
  }

  formato3Dec(num: number | null): string {
    if (num === null || num === undefined) return "0.000";
    return Number(num).toFixed(3);
  }

  formatoPorcentaje(num: number | null): string {
    if (num === null || num === undefined) return "0.000 %";
    return Number(num).toFixed(3) + " %";
  }

  validarNumero(event: any) {
    const input = event.target;
    let valor = input.value;

    // Quitar letras, signos, espacios
    valor = valor.replace(/[^0-9.]/g, "");

    const partes = valor.split(".");

    // Solo un punto decimal
    if (partes.length > 2) {
      valor = partes[0] + "." + partes[1];
    }

    // Máx 3 decimales SIN redondear
    if (partes[1] && partes[1].length > 3) {
      valor = partes[0] + "." + partes[1].substring(0, 3);
    }

    input.value = valor;
  }

  formatearTresDec(event: any) {
    const input = event.target;
    let valor = input.value;

    if (!valor) return;

    if (!valor.includes(".")) {
      valor = valor + ".000";
    }

    let [enteros, dec] = valor.split(".");
    dec = dec.substring(0, 3);

    while (dec.length < 3) dec += "0";

    input.value = `${enteros}.${dec}`;
  }

  soloEnterosPositivos(event: any) {
    const input = event.target;
    let valor = input.value;

    // Quitar todo lo que no sea dígito
    valor = valor.replace(/[^0-9]/g, "");

    // Evitar 0 como primer valor
    if (valor.startsWith("0")) {
      valor = valor.replace(/^0+/, "");
    }

    input.value = valor;
  }

  onChangeTipoPeriodo() {
    if (this.tipoPeriodoGracia === "NINGUNO") {
      this.periodoGracia = 0;
    } else {
      this.periodoGracia = 0;
    }
  }

  esPeriodoBloqueado(): boolean {
    return this.estadoConstruido || this.tipoPeriodoGracia === "NINGUNO";
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