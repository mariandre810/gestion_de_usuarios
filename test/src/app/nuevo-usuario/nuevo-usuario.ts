import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nuevo-usuario.html', // ⚠️ Verifica que apunte a './nuevo-usuario.html' o './nuevo-usuario.component.html'
  styleUrls: ['./nuevo-usuario.css']
})
export class NuevoUsuarioComponent {
  nuevoUsuario = {
    username: '',
    password: ''
  };

  mensajeError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  guardarUsuario() {
    this.http.post('http://localhost:3000/api/usuarios', this.nuevoUsuario).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al guardar el usuario';
      }
    });
  }
}