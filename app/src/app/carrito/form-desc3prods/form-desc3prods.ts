import { Component, inject } from '@angular/core';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoService } from '../../share/carrito.service';

@Component({
  selector: 'app-form-desc3prods',
  standalone: false,
  templateUrl: './form-desc3prods.html',
  styleUrl: './form-desc3prods.css',
})
export class FormDesc3prods {
  prods3Form!: FormGroup
  private carritoService = inject(CarritoService)

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private patternPorce = /^[1-9]\d*$/;

  private initForm(): void {
    this.prods3Form = this.fb.group({
      porcentaje: [null, [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern(this.patternPorce)]],
    })
  }

  guardarPorcentaje(event: any): void {
    this.prods3Form.markAllAsTouched();
    if (this.prods3Form.invalid) {      
      return;
    }

    let tempValue = Number(event.target.value)    
    this.carritoService.porcentajeDesc.set(tempValue)     
  }

  public errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.prods3Form, controlPath);
  }
}
