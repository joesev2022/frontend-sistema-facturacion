import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  titulo:string = "Crear cliente"
  cliente: Cliente = new Cliente()
  errores: string[];

  constructor(private clienteService: ClienteService, 
    private router: Router, 
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente() :void{
    this.activatedRouter.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      } 
    })
  }

  public create(): void{
    //console.log("clicked!")
    //console.log(this.cliente)
    this.clienteService.create(this.cliente)
      .subscribe( cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo cliente', `¡Cliente ${cliente.nombre} creado con éxito!`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  public update(): void{
    this.clienteService.update(this.cliente)
      .subscribe( json => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `Cliente ${json.cliente.nombre} actualizado con éxito`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

}
