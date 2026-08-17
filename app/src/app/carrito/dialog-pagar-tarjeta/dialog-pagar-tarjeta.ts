import { Component, inject, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../share/notification-service';

@Component({
  selector: 'app-dialog-pagar-tarjeta',
  standalone: false,
  templateUrl: './dialog-pagar-tarjeta.html',
  styleUrl: './dialog-pagar-tarjeta.css',
})
export class DialogPagarTarjeta {  
  readonly dialogTarjeta = inject(MatDialog);
  counter: number | undefined;

  constructor(    
    private router: Router,    
  ) {    
  }

  ngOnInit() {
    this.terminarTiempo();
  }

  terminarTiempo() {
    this.counter = window.setTimeout(() => {      
      console.log("TIEMPO FINALIZADOS")
      this.refreshInicio();
      this.dialogTarjeta.closeAll();
    }, 4000);
  }

  refreshInicio() {
    this.router.navigate(['/inicio']);
  }
}
