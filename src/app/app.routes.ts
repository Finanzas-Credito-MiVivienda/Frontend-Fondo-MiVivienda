import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { DetalleCliente } from './components/detalle-cliente/detalle-cliente';
import { OfertaInmueble } from './components/oferta-inmueble/oferta-inmueble';
import { GenerarCredito } from './components/generar-credito/generar-credito';
import { GenerarCronograma } from './components/generar-cronograma/generar-cronograma';
import { AgregarEntidadFinanciera } from './components/agregar-entidad-financiera/agregar-entidad-financiera';
import { PreguntasFrecuentes } from './components/preguntas-frecuentes/preguntas-frecuentes';
import { AutorizarLogeadoGuard } from './guards/autorizar-logueado-guard';
import { AutorizarClienteGuard } from './guards/autorizar-client-guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'registro-usuario', component: DetalleCliente },
  { path: 'registrar-entidad-financiera', component: AgregarEntidadFinanciera },
  { path: 'oferta-inmueble', component: OfertaInmueble },
  { path: 'generar-credito', component: GenerarCredito },
  { path: 'generar-cronograma', component: GenerarCronograma },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentes },
  { path: '**', redirectTo: '/login' }
]