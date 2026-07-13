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
import { UsuarioService } from '../../share/services/usuario.service';
import { UsuarioModel } from '../../share/models/UsuarioModel';


@Component({
  selector: 'app-usuario-admin',
  standalone: false,
  templateUrl: './usuario-admin.html',
  styleUrl: './usuario-admin.css',
})
export class UsuarioAdmin {
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns = ['CELDA_1', 'CELDA_2', 'CELDA_3', 'CELDA_4', 'acciones'];

  constructor(
    private userService: UsuarioService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.listUsers();
    this.paginator._intl.itemsPerPageLabel = 'Items';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Inicio';
    this.paginator._intl.lastPageLabel = 'Fin';
  }

  crearUsuario(){
    this.router.navigate(['/usuario/create']);
  }

  listUsers() {
  this.userService.get().subscribe((respuesta: UsuarioModel[]) => {
    this.datos = respuesta;
    this.dataSource.data = respuesta;
  });
}

    actualizarUsuario (id: Number) {
    this.router.navigate(['usuario/update', id],)
  }

  //Cargar tabla
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    /* this.listProductos(); */
  }
}
