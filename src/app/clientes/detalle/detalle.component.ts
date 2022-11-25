import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso:number = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService /*private activatedRoute: ActivatedRoute*/) { }

  ngOnInit(): void {
    /*this.activatedRoute.paramMap.subscribe(params => {
      //Con el simbolo + el parámetro se convierte en tipo number
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });*/
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal('Error seleccionar imagen', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      swal('Error de subida.', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if (event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          swal('La foto se subió correctamente.', response.mensaje, 'success'); 
        }
      });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura:Factura): void{
    swal({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}`,
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
        this.facturaService.delete(factura.id).subscribe(
          () => {
            //Esta linea elimina al cliente de la lista de forma automática.
            //Con filter se logra filtrar los clientes que no son el cliente que se ha eliminado.
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            swal(
              'Factura Elminada',
              `Factura ${factura.descripcion} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    });
  }

}
