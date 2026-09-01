import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    // Se envía el campo como username y usuario para cubrir ambas estructuras en Node.js
    const body = { 
      username: this.username, 
      usuario: this.username,
      password: this.password 
    };

    this.http.post<any>('http://localhost:3000/api/login', body)
      .subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          
          // Almacenar token o datos del usuario devueltos por el backend
          const token = res.token || res.accessToken || 'token_demo';
          localStorage.setItem('token', token);

          // Redirección inmediata a la lista de usuarios
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          
          // Si el servidor responde 401/404 o credenciales inválidas
          if (err.status === 401 || err.status === 404) {
            alert('Usuario o contraseña incorrectos.');
          } else {
            alert('Error al conectar con el servidor. Revisa la consola (F12).');
          }
        }
      });
  }
}