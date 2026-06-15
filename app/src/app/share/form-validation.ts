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
    forControl: 'montoPagar',
    forValidator: 'required',
    text: 'El monto a pagar es requerido',
  },
  {
    forControl: 'montoPagar',
    forValidator: 'pattern',
    text: 'El formato del monto a pagar es incorrecto',
  }/* ,
  {
    forControl: 'numeroTarjeta',
    forValidator: 'required',
    text: 'El número de tarjeta es requerido',
  },
  {
    forControl: 'numeroTarjeta',
    forValidator: 'minlength',
    text: 'El número de tarjeta debe de tener mínimo 16 digitos',
  },
  {
    forControl: 'numeroTarjeta',
    forValidator: 'maxlength',
    text: 'El número de tarjeta no debe de tener más 16 digitos',
  },
  {
    forControl: 'numeroTarjeta',
    forValidator: 'pattern',
    text: 'El formato del número de tarjeta es incorrecto',
  },
  {
    forControl: 'fechaExp',
    forValidator: 'required',
    text: 'La fecha de expiración es requerida',
  },
  {
    forControl: 'cvv',
    forValidator: 'required',
    text: 'El CVV es requerido',
  },
  {
    forControl: 'cvv',
    forValidator: 'minlength',
    text: 'El CVV debe de tener mínimo 3 digitos',
  },
  {
    forControl: 'cvv',
    forValidator: 'maxlength',
    text: 'El CVV no debe de tener más 3 digitos',
  },
  {
    forControl: 'cvv',
    forValidator: 'pattern',
    text: 'El formato del CVV es incorrecto',
  },
  {
    forControl: 'titular',
    forValidator: 'required',
    text: 'El nombre del titular es requerido',
  },
  {
    forControl: 'titular',
    forValidator: 'minlength',
    text: 'El nombre del titular debe de tener mínimo 3 carácteres',
  } */
  /* {
    forControl: 'correo',
    forValidator: 'required',
    text: 'El correo electrónico es requerido',
  },
  {
    forControl: 'correo',
    forValidator: 'minlength',
    text: 'El correo debe tener 3 carácteres mínimo',
  },
  {
    forControl: 'correo',
    forValidator: 'maxlength',
    text: 'El correo electrónico no debe tener más de 191 carácteres',
  },
  {
    forControl: 'correo',
    forValidator: 'email',
    text: 'El correo electrónico no cumple el formato correcto',
  },
  {
    forControl: 'correo',
    forValidator: 'pattern',
    text: 'El formato del correo electrónico brindado es incorrecto',
  },
  {
    forControl: 'contrasenna',
    forValidator: 'required',
    text: 'La contraseña es requerida',
  },
  {
    forControl: 'contrasenna',
    forValidator: 'minlength',
    text: 'La contraseña debe tener 3 carácteres mínimo',
  },
  {
    forControl: 'contrasenna',
    forValidator: 'maxlength',
    text: 'La contraseña no debe tener más de 191 carácteres',
  },
  {
    forControl: 'contrasenna',
    forValidator: 'pattern',
    text: 'La contraseña es débil y no cumple con el formato correcto',
  }, */
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
