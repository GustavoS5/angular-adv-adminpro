import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  hospitales: Hospital[] = [];
  hospitalesTemp: Hospital[] = [];
  cargando: boolean = true;
  imgSubs!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.eliminarHospital(hospital._id!).subscribe((resp) => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert() {
    const { value: nombre } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if (nombre?.trim().length) {
      this.hospitalService.crearHospital(nombre).subscribe((resp: any) => {
        Swal.fire(`Hospital ${nombre} creado`);
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id!,
      hospital.img
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.hospitales = this.hospitalesTemp);
    }

    this.busquedasService
      .buscar('hospitales', termino)
      .subscribe((resultados: any) => {
        this.hospitales = resultados;
        console.log(resultados);
      });
  }
}
