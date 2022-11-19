import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { of, Observable, catchError, throwError, map } from 'rxjs';
import { Cliente } from './cliente';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) { }

/*private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }*/

/*private isNoAutorizado(e): boolean{
    if(e.status == 401){
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if(e.status == 403){
      swal('Acceso denegado', `Hola, ${this.authService.usuario.username} no tienes accesos a este recurso.`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }

    return false;
  }*/

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones')
  }
  
  getClientes(page: number): Observable<any[]>{ 
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response:any) => response as Cliente[])
    );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      //Estoy parseando el response tipo json a tipo cliente.
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        }        
        return throwError(e);
      })
    );
  }

  getCliente(id) :Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente) : Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        } 
        return throwError(e);
      })
    );
  }

  delete(id: number) : Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje)
        } 
        return throwError(e);
      })
    );
  }

  subirFoto(archivo:File, id) : Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req)
  }

}
