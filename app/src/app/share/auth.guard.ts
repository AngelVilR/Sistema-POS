import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification-service';

// No necesitamos la clase UserGuard como tal para una CanActivateFn
// sino que la lógica se integra directamente en la función.

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): boolean | UrlTree => {
  // CanActivateFn puede retornar boolean o UrlTree

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const noti = inject(NotificationService);

  // 1. Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticatedSignal();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir y notificar
    const message = 'Usuario no autenticado';
    noti.warning('Autorización', 'Acceso denegado', 3000);
    router.navigate(['/iniciar-sesion']); // Redirige explícitamente
  }

  // 2. Si está autenticado, verificar roles si la ruta lo requiere
  const currentUser = authService.currentUserSignal(); // Obtenemos el usuario actual del signal

  if (!currentUser) {
    const message =
      'Datos de usuario no disponibles. Reautenticación necesaria.';
  }

  const userRole = currentUser?.role;
  //! REVISAR 'roles'
  const rolesAllowed = route.data['roles'] || []; // Obtener roles permitidos de la data de la ruta

  // 3. Verificar roles si están definidos en la ruta
  if (rolesAllowed.length > 0 && !rolesAllowed.includes(userRole)) {
    // Si hay roles definidos para la ruta y el usuario no tiene uno de ellos
    const message = 'Acceso Denegado';
    noti.warning('No tiene permisos para acceder a este sitio', message, 3000);
    router.navigate(['/iniciar-sesion']);
  }

  // 4. Si pasa todas las comprobaciones, permitir el acceso
  return true;
};
