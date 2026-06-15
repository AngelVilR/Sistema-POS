import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { NotificationService } from '../../share/notification-service';

@Component({
  selector: 'app-dialog-pagar-tarjeta',
  standalone: false,
  templateUrl: './dialog-pagar-tarjeta.html',
  styleUrl: './dialog-pagar-tarjeta.css',
})
export class DialogPagarTarjeta {

  constructor(
    private router: Router,
    private noti: NotificationService
  ) { }

  ngOnInit() {
    this.terminarVenta();
  }

  readonly dialogTarjeta = inject(MatDialog);
  counter: number | undefined;
  

  terminarVenta() {
    this.counter = window.setTimeout(() => {
      this.noti.success(
        'Venta finalizada',
        'Se ha completado el pago exitosamente',
        5000
      );
      this.dialogTarjeta.closeAll();
      this.router.navigate(['/'])      
    }, 3000);
  }

  cancelarVenta() {
    clearTimeout(this.counter);
  }
}
