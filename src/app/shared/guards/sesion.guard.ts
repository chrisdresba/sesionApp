import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service/auth.service';

export const sesionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return  authService.isAuthenticated() ? true : (router.navigate(['/login']), false);
};