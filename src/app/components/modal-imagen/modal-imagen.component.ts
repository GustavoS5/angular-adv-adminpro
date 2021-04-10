import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  imagenSubir!: File;
  imgTemp: string | ArrayBuffer | null = '';

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo!, id)
      .then((img) => {
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
