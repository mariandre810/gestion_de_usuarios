import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { UsuariosComponent } from './usuarios/usuarios';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/nuevo', component: NuevoUsuarioComponent },
  { path: '**', redirectTo: 'login' }
];