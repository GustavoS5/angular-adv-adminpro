import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuario: Usuario;
  imagenSubir!: File;
  imgTemp: string | ArrayBuffer | null = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPefil() {
    this.usuarioService.actualizarPefil(this.perfilForm.value).subscribe(
      (resp) => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cambiarImagen(event: Event) {
    const input = (event.target as HTMLInputElement).files![0];

    this.imagenSubir = input;

    if (!input) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(input);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then((img) => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.usuario.img = img;
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
