import { Component } from '@angular/core';
/* import { ProductoService } from '../../share/services/producto.service'; */
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
/* import { UtilsService } from '../../share/utils-service'; */
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';
import { FacturaService } from '../../share/services/factura.service';
import { FacturaModel } from '../../share/models/FacturaModel';
import { UtilService } from '../../share/util-service';


@Component({
  selector: 'app-venta-admin',
  standalone: false,
  templateUrl: './venta-admin.html',
  styleUrl: './venta-admin.css',
})
export class VentaAdmin {
  data: any;
  dataLength: any

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private serviceFactura: FacturaService,
    private utilsService: UtilService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.listFacturas();
  }

  listFacturas() {
    this.serviceFactura
      .get()
      .subscribe((data: FacturaModel[]) => {
        data.forEach(x => {
          x.fechaString = this.utilsService.FormatearFechas(x.fecha);
          x.metodo_pago = this.utilsService.MetodoPagoToString(x.metodo_pago);
        });
        
        console.log(data)
        this.data = data;
        this.dataLength = this.data.length;
      })
  }

  goDetailVenta(prId: number){
    this.router.navigate(["venta-detail", prId]);
  }
}
