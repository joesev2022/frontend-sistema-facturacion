import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes : Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private modalService: ModalService,
    private activatedRouter: ActivatedRoute
    ) { }

  ngOnInit(): void {
    //El activatedRouter trabajará como un observable cada vez que cambia la página    
    this.activatedRouter.paramMap.subscribe( params => {
      //Obtiene el parametro page y se castea a Integer con el símbolo '+'
      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page)
      .subscribe(
        (response: any) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
      this.modalService.notificarUpload.subscribe(cliente => {
        this.clientes = this.clientes.map(clienteOriginal =>{
          if(cliente.id == clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        });
      });
    });
  }

  delete(cliente: Cliente): void{
    swal({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if(result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //Esta linea elimina al cliente de la lista de forma automática.
            //Con filter se logra filtrar los clientes que no son el cliente que se ha eliminado.
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal(
              'Cliente Elminado',
              `Cliente ${cliente.nombre} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
