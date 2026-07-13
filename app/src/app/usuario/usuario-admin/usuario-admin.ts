import { Component, inject, ViewChild } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { UtilService } from '../../share/util-service';


@Component({
  selector: 'app-usuario-admin',
  standalone: false,
  templateUrl: './usuario-admin.html',
  styleUrl: './usuario-admin.css',
})
export class UsuarioAdmin {
  data: any;
  dataLength: any

  destroy$: Subject<boolean> = new Subject<boolean>();

  private dialogForm = inject(MatDialog)

  constructor(
    private userService: UsuarioService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.listUsers();
  }

  ngAfterViewInit(): void {
    this.listUsers()
  }

  crearUsuario() {
    this.router.navigate(['/usuario/create']);
  }

  private listUsers() {
    this.userService
      .get()
      .subscribe((respuesta: UsuarioModel[]) => {
        respuesta.map((x:UsuarioModel)=>{
          x.formatoRole = this.util.RoleUsuarioToString(x.role);
        })     
                   
        this.data = respuesta;
        this.dataLength = this.data.length
      });
  }

  actualizarUsuario(id: Number) {
    this.router.navigate(['usuario/update', id],)
  }

  openDialogCreateUsuario() {
    this.dialogForm.open(UsuarioForm)
  }

  openDialogUpdateUsuario(prUsuario: UsuarioForm) {
    this.dialogForm.open(UsuarioForm, { data: prUsuario })
  }
}
