import { Component } from '@angular/core';
import { FacturaService } from '../../share/services/factura.service';
import { UtilService } from '../../share/util-service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaModel } from '../../share/models/FacturaModel';
import { pipe, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-venta-detail',
  standalone: false,
  templateUrl: './venta-detail.html',
  styleUrl: './venta-detail.css',
})
export class VentaDetail {
  datos: any
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private serviceFactura: FacturaService,
    private utilsService: UtilService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let idVenta = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(idVenta))) {
      this.getFactura(Number(idVenta))
    }
  }

  getFactura(prId: number) {
    this.serviceFactura
      .getById(prId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FacturaModel) => {
        data.fechaString = this.utilsService.FormatearFechas(data.fecha);
        data.metodo_pago = this.utilsService.MetodoPagoToString(data.metodo_pago);
        this.datos = data
      })
  }
}
