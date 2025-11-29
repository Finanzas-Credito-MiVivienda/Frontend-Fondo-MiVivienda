import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-preguntas-frecuentes',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './preguntas-frecuentes.html',
  styleUrl: './preguntas-frecuentes.css',
})
export class PreguntasFrecuentes {
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  constructor(private router: Router) { }

  faqs = [
    {
      icon: "account_balance",
      pregunta: "¿Cómo funciona el proceso de financiamiento?",
      respuesta:
        "El proceso inicia seleccionando un inmueble, luego eligiendo una entidad financiera, registrando los gastos y tasas correspondientes y finalmente generando tu crédito y su cronograma.",
      open: false
    },
    {
      icon: "edit",
      pregunta: "¿Puedo modificar los valores ingresados en la entidad financiera?",
      respuesta:
        "Sí. Puedes modificar los montos y tasas antes de generar el crédito. Si cambias valores después, debes volver a guardar y recalcular.",
      open: false
    },
    {
      icon: "trending_up",
      pregunta: "¿Qué significa la TEA y cómo afecta a mi crédito?",
      respuesta:
        "La TEA determina el costo total del crédito. Puedes usar la del banco o ingresar otra para simular escenarios distintos.",
      open: false
    },
    {
      icon: "timer",
      pregunta: "¿Cuántos periodos de gracia puedo usar?",
      respuesta:
        "Puedes elegir hasta 6 meses de periodo de gracia, en modalidad total o parcial.",
      open: false
    },
    {
      icon: "receipt_long",
      pregunta: "¿Qué incluye el cronograma de pagos?",
      respuesta:
        "Incluye interés, amortización, seguros, comisiones, portes y el flujo total del periodo.",
      open: false
    },
    {
      icon: "insights",
      pregunta: "¿Qué indicadores puedo obtener?",
      respuesta:
        "VAN, TIR, TCEA y COK. Estos permiten evaluar la conveniencia del financiamiento.",
      open: false
    },
    {
      icon: "home",
      pregunta: "¿Puedo financiar cualquier inmueble?",
      respuesta:
        "Sí, siempre y cuando esté registrado y cumplas el requisito de ingreso mínimo.",
      open: false
    },
    {
      icon: "bar_chart",
      pregunta: "¿Puedo visualizar el gráfico del crédito?",
      respuesta:
        "Sí. Desde el cronograma puedes ver un gráfico de interés vs amortización para analizar tu deuda.",
      open: false
    }
  ];

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