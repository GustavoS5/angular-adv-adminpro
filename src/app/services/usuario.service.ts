import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '491636800956-moh2ecmps0c9u7v3o8uuhjdt8gresb1q.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/auth/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(
          nombre,
          email,
          undefined,
          img,
          google,
          role,
          uid
        );

        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError((err) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPefil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role!,
    };

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  loginUsuario(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: any) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.email,
              undefined,
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );

        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }

  eliminarUsuario(uid: string) {
    const url = `${base_url}/usuarios/${uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
