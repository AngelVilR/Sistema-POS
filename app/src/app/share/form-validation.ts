import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
/**
 * Interface para los mensajes de error de form validation.
 */
export interface FormValidatorMessage {
  forControl: string;
  forValidator: string;
  text: string;
}

//Mensajes de errores de validación
export const FormErrorMessage: FormValidatorMessage[] = [
  {
    forControl: 'productoId',
    forValidator: 'required',
    text: 'Debe de seleccionar un producto',
  },
  {
    forControl: 'eventoId',
    forValidator: 'required',
    text: 'Debe de seleccionar un evento',
  },
  {
    forControl: 'usuarioId',
    forValidator: 'required',
    text: 'Debe de seleccionar un usuario',
  },
  {
    forControl: 'cantidad',
    forValidator: 'required',
    text: 'La cantidad es requerida',
  },
  {
    forControl: 'cantidad',
    forValidator: 'min',
    text: 'La cantidad mínima es 1',
  },
  {
    forControl: 'cantidad',
    forValidator: 'pattern',
    text: 'Debe de digitar únicamente números',
  },
  {
    forControl: 'montoPagar',
    forValidator: 'required',
    text: 'El monto a pagar es requerido',
  },
  {
    forControl: 'montoPagar',
    forValidator: 'pattern',
    text: 'El formato del monto a pagar es incorrecto',
  },
  {
    forControl: 'nombre',
    forValidator: 'required',
    text: 'El nombre de usuario es requerido',
  },
  {
    forControl: 'nombre',
    forValidator: 'minlength',
    text: 'El nombre de usuario debe tener al menos 3 caracteres',
  },
  {
    forControl: 'nombre',
    forValidator: 'maxlength',
    text: 'El nombre de usuario no debe tener más de 25 caracteres',
  },
  {
    forControl: 'email',
    forValidator: 'required',
    text: 'El correo es requerido',
  },
  {
    forControl: 'email',
    forValidator: 'email',
    text: 'El correo no cumple con el formato correcto',
  },
  {
    forControl: 'email',
    forValidator: 'emailTaken',
    text: 'Ya existe una cuenta con este correo electrónico',
  },
  {
    forControl: 'password',
    forValidator: 'required',
    text: 'La contraseña es requerida',
  },
  {
    forControl: 'password',
    forValidator: 'maxlength',
    text: 'La contraseña no puede tener más de 6 digitos',
  },
  {
    forControl: 'password',
    forValidator: 'minlength',
    text: 'La contraseña no puede tener menos de 6 digitos',
  },
  {
    forControl: 'password',
    forValidator: 'pattern',
    text: 'La contraseña solo puede contener numeros',
  },
  {
    forControl: 'telefono',
    forValidator: 'maxlength',
    text: 'El teléfono no puede tener más de 8 digitos',
  },
  {
    forControl: 'telefono',
    forValidator: 'minlength',
    text: 'El teléfono no puede tener menos de 8 digitos',
  },
  {
    forControl: 'telefono',
    forValidator: 'pattern',
    text: 'El teléfono solo puede contener numeros',
  },
];

/**
 * Recupera el mensaje de error de validación apropiado para un control de formulario determinado.
 *
 * @param control La instancia de AbstractControl (FormControl, FormGroup o FormArray).
 * @param controlName el nombre del control, tal como se define en FormErrorMessage.
 * @returns La cadena del mensaje de error si existe un error y el control está touched/dirty, de lo contrario es falso.
 */
export function getFormValidationErrorMessage(
  formGroup: FormGroup | FormArray,
  controlPath: string
): string | false {
  const control = formGroup.get(controlPath);
  if (!control) {
    return false;
  }
  // Validar los FormControl individuales.
  if (control instanceof FormGroup || control instanceof FormArray) {
    // Si el path es para un grupo/array y no tiene errores *directos*,
    // significa que los errores están en sus hijos y se manejarían por separado.
    if (!control.errors || !Object.keys(control.errors).length) {
      return false;
    }
  }
  if (control.invalid && (control.dirty || control.touched)) {
    // Iterar sobre los posibles errores del control
    for (const validatorName in control.errors) {
      if (control.errors.hasOwnProperty(validatorName)) {
        // Obtenemos el nombre "base" del control, sin la ruta del array 
        // (ej. 'anno_lanzamiento' de 'plataformas.0.anno_lanzamiento')
        const baseControlName = controlPath.split('.').pop() || controlPath;

        // Buscamos el mensaje de error en la lista global
        for (const message of FormErrorMessage) {
          if (
            message.forControl === baseControlName &&
            message.forValidator === validatorName
          ) {
            return message.text;
          }
        }
      }
    }
  }

  return false;
}
