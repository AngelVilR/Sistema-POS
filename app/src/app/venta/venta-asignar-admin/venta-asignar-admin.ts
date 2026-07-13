import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
/* import { ProductoService } from '../../share/services/producto.service'; */
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
/* import { UtilsService } from '../../share/utils-service'; */
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';
import { VentaService } from '../../share/services/venta.service';
import { VentaModel } from '../../share/models/VentaModel';


@Component({
  selector: 'app-venta-asignar-admin',
  standalone: false,
  templateUrl: './venta-asignar-admin.html',
  styleUrl: './venta-asignar-admin.css',
})
export class VentaAsignarAdmin {
  destroy$: Subject<boolean> = new Subject<boolean>();

  data: any;
  dataLength: any

  constructor(
    private serviceVenta: VentaService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getListColabs();
  }

  getListColabs() {
    this.serviceVenta
      .get()
      .subscribe((data: VentaModel[]) => {
        this.data = data
        this.dataLength = this.data.length
        console.log(this.data)
      })
  }

  goAsignarCreate() {
    this.router.navigate(['/asignar-producto/create'], {
      relativeTo: this.route
    })
  }

  goAsignarUpdate(prItem: VentaModel) {
    this.router.navigate(['asignar-producto/update', prItem.eventoId, prItem.usuarioId, prItem.productoId])
  }

  /* deleteAsignarUpdate(prItem: VentaModel) {
    this.serviceVenta
      .delete(prItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: VentaModel) => {
        console.log("Producto eliminado")
      })
  } */
}
