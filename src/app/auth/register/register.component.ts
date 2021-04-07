import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]],
    },
    {
      validators: [this.passwordsIguales('password', 'password2')],
    }
  );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router:Router
  ) {}

  crearUsuario() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    //Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (resp) => {
        //Navegar al dashboard
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        //Si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  campoNoValido(campo: string) {
    return (
      this.registerForm.controls[campo].errors &&
      this.registerForm.controls[campo].touched
    );
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1 = formGroup.get(pass1Name)?.value;
      const pass2 = formGroup.get(pass2Name)?.value;

      if (pass1 !== pass2) {
        formGroup.get(pass2Name)?.setErrors({ noIguales: true });
        return { noIguales: true };
      }

      formGroup.get(pass2Name)?.setErrors(null);

      return null;
    };
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }
}
