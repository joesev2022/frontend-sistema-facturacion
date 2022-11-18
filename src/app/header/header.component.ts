import { Component } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    public title: string = 'Angular App';

    constructor(public authService: AuthService, private router: Router){

    }

    logout(): void {
        let usuario = this.authService.usuario.username;
        this.authService.logout();
        swal('Logout', `Hola ${usuario}, has cerrado sesion con éxito.`, 'success');
        this.router.navigate(['/login']);
    }

}