import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  medicos: Medico[] = [];
  medicosTemp: Medico[] = [];
  cargando: boolean = true;
  imgSubs!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe((medicos) => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.medicos = this.medicosTemp);
    }

    this.busquedasService
      .buscar('medicos', termino)
      .subscribe((resultados: any) => {
        this.medicos = resultados;
      });
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id!).subscribe((resp) => {
          this.cargarMedicos();

          Swal.fire(
            'Médico borrado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }
}
