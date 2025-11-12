import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { AgregarEntidadFinanciera } from './components/agregar-entidad-financiera/agregar-entidad-financiera';
import { DetalleCliente } from './components/detalle-cliente/detalle-cliente';

export const routes: Routes = [
  {
    path: 'login', component: Login
  },
  {
    path: 'agregar-entidad-financiera', component: AgregarEntidadFinanciera
  },
  {
    path: 'info', component: DetalleCliente
  }
]
