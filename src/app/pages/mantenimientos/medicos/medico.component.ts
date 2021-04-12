import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit, OnDestroy {
  medicoForm!: FormGroup;
  hospitales: Hospital[] = [];
  hospitalSeleccionado?: Hospital;
  medicoSeleccionado?: Medico;
  cargando: boolean = true;
  subs?: Subscription;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.subs = this.medicoForm
      .get('hospital')
      ?.valueChanges.subscribe((hospitalId) => {
        this.hospitalSeleccionado = this.hospitales.find(
          (h) => h._id === hospitalId
        );
      });
  }

  cargarHospitales() {
    this.hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService.actualizarMedico(data).subscribe((resp) => {
        Swal.fire(
          'Actualizado',
          `${nombre} actualizado correctamente`,
          'success'
        );
      });
    } else {
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }

  cargarMedico(id: string) {
    this.cargando = true;

    if (id === 'nuevo') {
      return;
    }

    this.medicoService
      .obtenerMedicoPorId(id)
      .pipe(delay(100))
      .subscribe((medico) => {
        if (medico === null || medico === undefined) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        const {
          nombre,
          hospital: { _id },
        } = medico;

        this.medicoSeleccionado = medico;
        this.cargando = false;
        this.medicoForm.setValue({ nombre, hospital: _id });
      });
  }
}
