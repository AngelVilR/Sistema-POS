import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../share/services/evento.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoModel } from '../../share/models/EventoModel';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from '../../share/util-service';
import { EventoForm } from '../evento-form/evento-form';

@Component({
  selector: 'app-evento-admin',
  standalone: false,
  templateUrl: './evento-admin.html',
  styleUrl: './evento-admin.css',
})

export class EventoAdmin {
  data: any;
  dataLength: any;

  private dialogForm = inject(MatDialog)

  constructor(
    private eService: EventoService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.listEventos();
  }

  private listEventos(): void {
    this.eService
      .get()
      .subscribe({
        next: (data) => {
          data.map((x: EventoModel) => {
            x.formatoFechaInicio = this.util.FormatearFechas(x.fechaInicio)
            x.formatoFechaFin = this.util.FormatearFechas(x.fechaFin)
          })

          this.data = data;
          this.dataLength = this.data.length
        },
        error: () => {
          this.noti.error('Error', 'Error al cargar los eventos');
        },
      });
  }

  openDialogCreateEvento() {
    this.dialogForm.open(EventoForm)
  }

  openDialogUpdateEvento(prEvento: EventoModel) {
    this.dialogForm.open(EventoForm, { data: prEvento })
  }

}
