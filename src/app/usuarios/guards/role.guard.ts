import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/clientes']);
        return false;
      }

      let role = route.data['role'] as string;
      console.log(role);
      
      if (this.authService.hasRole(role)) {
        return true;
      }
      swal('Acceso denegado', `Hola, ${this.authService.usuario.username} no tienes accesos a este recurso.`, 'warning');
      this.router.navigate(['/clientes']);
      return false;
  }
  
}
