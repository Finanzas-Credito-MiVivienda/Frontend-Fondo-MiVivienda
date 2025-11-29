import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Pagos } from '../../services/pagos';
import { Indicadores } from '../../services/indicadores';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-generar-cronograma',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './generar-cronograma.html',
  styleUrl: './generar-cronograma.css',
})
export class GenerarCronograma {
  cuotas: any[] = [];
  datosCredito: any = null;
  indicadores: any = null;
  teaOriginal: number = 0;
  showTotales: boolean = false;
  totales: any = null;
  tablaGenerada: boolean = false;
  mostrarIndicadores: boolean = false;
  grafico: any;
  mostrarGrafico: boolean = false;
  moneda: string = localStorage.getItem("currencyType") || "PEN";
  mostrarAsistente: boolean = false;

  constructor(private pagosService: Pagos, private indicadoresService: Indicadores, private router: Router) { }

  ngOnInit() {
    const creditoGuardado = localStorage.getItem("creditoRegistrado");

    if (!creditoGuardado) {
      console.error("No hay crédito registrado");
      return;
    }

    const data = JSON.parse(creditoGuardado);

    this.teaOriginal = data.teaOriginal;

    this.datosCredito = {
      fechaRegistro: data.fechaInicio,
      saldoFinanciar: data.saldoFinanciar,
      bbp: data.bonoBuenPagador,
      montoPrestamo: data.montoPrestamo,
      nCuotasxAnio: data.ncuotasxAnio,
      nTotalCuotas: data.ntotalCuotas,
      pCuotaInicial: data.pcuotaInicial,
      seguroDesgravamenPerd: data.seguroDegPerd,
      seguroRiesgoPerd: data.seguroRiesgoPerd
    };
  }

  generarTabla() {
    const creditoGuardado = localStorage.getItem("creditoRegistrado");
    if (!creditoGuardado) return;

    const data = JSON.parse(creditoGuardado);
    const idCredito = data.id;

    this.pagosService.getPlanPagosCronograma(idCredito).subscribe({
      next: (resp) => {
        console.log("Cronograma recibido:", resp);
        this.cuotas = resp;
        this.tablaGenerada = true;
      },
      error: (err) => console.error("Error al cargar cronograma:", err)
    });
  }

  verTotales() {
    const creditoGuardado = localStorage.getItem("creditoRegistrado");
    if (!creditoGuardado) return;

    const data = JSON.parse(creditoGuardado);
    const idCredito = data.id;

    this.pagosService.getPlanPagosTotales(idCredito).subscribe({
      next: (resp) => {
        this.totales = resp;
        this.showTotales = true;
      },
      error: (err) => console.error("Error al cargar totales:", err)
    });
  }

  cerrarTotales() {
    this.showTotales = false;
  }

  verIndicadores() {
    const creditoGuardado = localStorage.getItem("creditoRegistrado");
    if (!creditoGuardado) return;

    const data = JSON.parse(creditoGuardado);
    const idCredito = data.id;

    this.indicadoresService.getIndicadores(idCredito).subscribe({
      next: (resp) => {
        console.log("Indicadores recibidos:", resp);
        this.indicadores = resp;
        this.mostrarIndicadores = true;
      },
      error: (err) => console.error("Error al obtener indicadores:", err)
    });
  }

  cerrarIndicadores() {
    this.mostrarIndicadores = false;
  }


  verGrafico() {
    if (!this.tablaGenerada) return;

    this.mostrarGrafico = true;

    setTimeout(() => {
      this.generarGrafico();
    }, 200);
  }

  generarGrafico() {
    const labels = this.cuotas.map(c => c.numeroCuota);

    const intereses = this.cuotas.map(c => Number(c.interes));
    const amortizaciones = this.cuotas.map(c => Number(c.amortizacion));

    const canvas: any = document.getElementById('graficoBarras');

    if (this.grafico) {
      this.grafico.destroy();
    }

    this.grafico = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Interés',
            data: intereses,
            backgroundColor: 'rgba(255, 159, 64, 0.7)'
          },
          {
            label: 'Amortización',
            data: amortizaciones,
            backgroundColor: 'rgba(54, 162, 235, 0.7)' // azul suave
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: 'N° de Cuota' }
          },
          y: {
            stacked: true,
            title: { display: true, text: 'Monto (S/.)' }
          }
        }
      }
    });
  }

  cerrarGrafico() {
    this.mostrarGrafico = false;
    if (this.grafico) {
      this.grafico.destroy();
    }
  }

  getSimbolo() {
    return this.moneda === "USD" ? "$" : "S/";
  }

  esPositivo(valor: any): boolean {
    if (valor === null || valor === undefined) return false;
    return Number(valor) >= 0;
  }

  esNegativo(valor: any): boolean {
    if (valor === null || valor === undefined) return false;
    return Number(valor) < 0;
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