import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, catchError, debounceTime, switchMap, of } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

export function emailExistsValidator(usuarioService: UsuarioService, getCurrentEmail?: () => string): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null); // No validar si está vacío

    if (getCurrentEmail && control.value === getCurrentEmail()) {
      return of(null); // No validar si es el mismo correo que el actual
    }
    return of(control.value).pipe(
      debounceTime(300), // Evita llamadas excesivas
      switchMap(email =>
        usuarioService.checkEmailExists(email).pipe(
          map(exists => (exists ? { emailTaken: true } : null)),
          catchError(() => of(null)) // En caso de error, no bloquear el campo
        )
      )
    );
  };
}