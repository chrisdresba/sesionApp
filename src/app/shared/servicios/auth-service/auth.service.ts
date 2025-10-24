import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      console.log('Error al registrar usuario:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await result.user?.getIdToken();
      if (token) {
        localStorage.setItem('token', token);
      }
      return result;
    } catch (error) {
      console.log('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}