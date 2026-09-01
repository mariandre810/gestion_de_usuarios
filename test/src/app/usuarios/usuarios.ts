import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  // Paginación (5 registros por página)
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.http.get<any[]>('http://localhost:3000/api/usuarios')
      .subscribe({
        next: (data) => {
          this.usuarios = data || [];
          // Fuerza el renderizado visual en la vista
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
          this.usuarios = [];
        }
      });
  }

  get usuariosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.usuarios.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuarios.length / this.itemsPorPagina) || 1;
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  crearUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}