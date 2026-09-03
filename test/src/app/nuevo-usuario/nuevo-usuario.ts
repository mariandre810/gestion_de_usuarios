import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nuevo-usuario.html',
  styleUrls: ['./nuevo-usuario.css']
})
export class NuevoUsuarioComponent {
  nuevoUsuario = {
    username: '',
    password: ''
  };
 
  mensajeError: string = '';
  mensajeExito: string = '';
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
 
  guardarUsuario() {
    this.mensajeError = '';
    this.mensajeExito = '';
 
    this.http.post<any>('http://localhost:3000/api/usuarios', this.nuevoUsuario).subscribe({
      next: (respuesta) => {
        this.mensajeExito = respuesta.message || 'Usuario creado exitosamente.';
        this.nuevoUsuario = { username: '', password: '' };
        this.cdr.detectChanges();
 
        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 1500);
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al guardar el usuario';
        this.cdr.detectChanges();
      }
    });
  }
 
  cerrarError(): void {
    this.mensajeError = '';
    this.router.navigate(['/usuarios']);
  }
}